import { darkThemeColors, lightThemeColors } from "../definitionStore";
import useAppStore from "../store/appStore";


function getThemeColors(){
    const theme = useAppStore.getState().theme;

    return theme==='light' ? lightThemeColors : darkThemeColors;
}

export default getThemeColors;
