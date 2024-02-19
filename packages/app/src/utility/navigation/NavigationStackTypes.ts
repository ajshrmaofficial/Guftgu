import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type NavStackParamList = {
    Login: undefined;
    Register: undefined;
    Guftgu: undefined;
    Mehfil: undefined;
};

export type NavStackProps<T extends keyof NavStackParamList> = NativeStackScreenProps<NavStackParamList, T>;
// export type AppStackNavProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;
