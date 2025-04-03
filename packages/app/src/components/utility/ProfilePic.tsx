import React, { useEffect, useState } from 'react';
import { Image, ActivityIndicator, View } from 'react-native';
import { downloadProfilePic } from '../../utility/storage bucket/storageFunctions';
import { getFriendListFromDB } from '../../utility/dbModel/db';
import RNFS from 'react-native-fs';

interface Friend {
    username: string;
    profilePic?: string;
    profilePicExtension?: string;
}

interface ProfilePicProps {
    username: string;
    size?: number;
}

function ProfilePic({ username, size = 40 }: ProfilePicProps): React.JSX.Element {
    const [profilePicPath, setProfilePicPath] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadProfilePic = async () => {
            try {
                const friends: any = await getFriendListFromDB().fetch();
                const friend = friends.find((f: Friend) => f.username === username);
                
                if (!isMounted) return;

                let path = null;

                // Try to use cached image first
                if (friend?.profilePic) {
                    const fileExists = await RNFS.exists(friend.profilePic);
                    if (fileExists) {
                        path = friend.profilePic;
                    }
                }

                // If no cached image, try to download
                if (!path) {
                    path = await downloadProfilePic(username, friend?.profilePicExtension);
                }

                if (isMounted) {
                    setProfilePicPath(path);
                }
            } catch (error) {
                console.warn(`Error loading profile picture for ${username}:`, error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadProfilePic();

        return () => {
            isMounted = false;
        };
    }, [username]);

    const containerClasses = `h-12 w-12 rounded-full overflow-hidden border border-black mr-2`;
    const imageClasses = `w-12 h-12`;

    if (isLoading) {
        return (
            <View className={containerClasses}>
                <ActivityIndicator size="small" />
            </View>
        );
    }

    const defaultImage = require('../../../assets/png/default-profile.png');

    return (
        <View className={containerClasses}>
            <Image
                source={profilePicPath ? { uri: `file://${profilePicPath}` } : defaultImage}
                defaultSource={defaultImage}
                className={imageClasses}
                onError={() => setProfilePicPath(null)}
            />
        </View>
    );
}

export default ProfilePic;