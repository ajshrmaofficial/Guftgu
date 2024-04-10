import React from "react";
import useMenu from "./MenuModal";
import useAddFriend from "./AddFriendModal";
import { bottomModalCollection } from "../utility/definitionStore";

function TabHeaderModals(bottomModalRef: bottomModalCollection):React.JSX.Element {
    const {menuModalRef, addFriendModalRef} = bottomModalRef;
    const {MenuModal} = useMenu(menuModalRef);
    const {AddFriendModal} = useAddFriend(addFriendModalRef);
    return(
        <>
            <MenuModal/>
            <AddFriendModal/>
        </>
    )
}

export default TabHeaderModals;
