import {TextInput, View, FlatList, TouchableOpacity} from 'react-native';
import {withBottomSheet} from './utility/BottomSheet';
import {BottomSheetModal, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {Text} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {searchChatsFromDB} from '../utility/dbModel/db';
import {useState, useCallback, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import getThemeColors from '../utility/theme';
import Loader from './utility/Loader';

// Custom hook for debouncing
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

function SearchChatModalComponent({
  navigation,
  bottomModalRef,
}: {
  navigation?: any;
  bottomModalRef: React.RefObject<BottomSheetModal>;
}) {
  const [inputText, setInputText] = useState('');
  const debouncedSearchText = useDebounce(inputText, 300);
  const {text, icons, border} = getThemeColors();

  const {data: searchResults, isLoading} = useQuery({
    queryKey: ['searchChats', debouncedSearchText],
    queryFn: () => searchChatsFromDB(debouncedSearchText),
    enabled: debouncedSearchText.length > 0,
  });

  const handleMessagePress = (message: any) => {
    // Navigate to chat screen with the selected user
    // if (navigation) {
    //     navigation.navigate('ChatScreen', {
    //         username: message.senderUsername === 'me' ? message.receiverUsername : message.senderUsername,
    //         name: message.senderUsername === 'me' ? message.receiverName : message.senderName,
    //     });
    // }
    bottomModalRef.current?.close();
  };

  const renderSearchResult = ({item}: {item: any}) => (
    <TouchableOpacity
      onPress={() => handleMessagePress(item)}
      className="p-4 border-b border-gray-200">
      <View className="flex-row justify-between items-center">
        <Text className={`${text.secondary.tailwind} text-sm`}>
          {item.senderUsername === 'me' ? 'You' : item.senderUsername}
        </Text>
        <Text className={`${text.secondary.tailwind} text-xs`}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text className={`${text.primary.tailwind}`} numberOfLines={2}>
        {item.message}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 self-center items-center w-full">
      <Text className={`${text.primary.tailwind} text-lg font-medium mb-4`}>
        Search Chat
      </Text>
      <View
        className={`w-11/12 flex-row items-center border p-1 rounded-xl mb-3 ${border.primary.tailwind}`}>
        <Icon name="search" size={24} color={icons.secondary.hex} />
        <BottomSheetTextInput
          placeholder="Search"
          onChangeText={setInputText}
          placeholderTextColor={text.secondary.hex}
          style={{color: text.primary.hex, fontSize: 18, flex: 1}}
        />
      </View>

      {isLoading && <Loader />}

      {searchResults && searchResults.length === 0 && debouncedSearchText && (
        <Text className="text-gray-500">No messages found</Text>
      )}

      <FlatList
        data={searchResults}
        renderItem={renderSearchResult}
        keyExtractor={item => item.id}
        className="w-full"
        contentContainerStyle={{flexGrow: 1}}
      />
    </View>
  );
}

const SearchChatModal = withBottomSheet(SearchChatModalComponent);

export default SearchChatModal;
