import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

export type AppTabParamList = {
    Guftgu: undefined;
    Mehfil: undefined;
    Map: undefined;
}

export type AppStackParamList = {
    AppTabs: NavigatorScreenParams<AppTabParamList>;
    ChatScreen: { username: string };
    Profile: undefined;
}

export type AuthStackProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<AuthStackParamList, T>;
// export type AppStackProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;
export type AppNavigationProps = CompositeScreenProps<NativeStackScreenProps<AppStackParamList>, BottomTabScreenProps<AppTabParamList>>;
// export type AppTabProps<T extends keyof AppTabParamList> = BottomTabScreenProps<AppTabParamList, T>;
