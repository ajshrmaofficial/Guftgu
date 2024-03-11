import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type NavStackParamList = {
    Login: undefined;
    Register: undefined;
};

export type NavTabParamList = {
    Guftgu: undefined;
    Mehfil: undefined;
    Map: undefined;
}

export type NavStackProps<T extends keyof NavStackParamList> = NativeStackScreenProps<NavStackParamList, T>;
export type NavTabProps<T extends keyof NavTabParamList> = BottomTabScreenProps<NavTabParamList, T>;
