import { create } from "zustand";
import { LocationMarker, LocationPayload } from "../definitionStore";

interface MiscState{
    friendsLocations: LocationMarker[]
}

interface MiscStateSetter{
    setFriendLocation: (friendLocation: LocationMarker) => void
}

const useMiscStore = create<MiscState & MiscStateSetter>()((set) => ({
    friendsLocations: [],
    setFriendLocation: (friendLocation: LocationMarker) => set((state) => ({friendsLocations: [...state.friendsLocations, friendLocation]}))
}))

export default useMiscStore;
