import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {Portal} from '@gorhom/portal';
import {useCallback} from 'react';

interface WithBottomSheetProps {
  bottomModalRef: React.RefObject<BottomSheetModal>;
  initialIndex: number;
  snapPointsArr: Array<string>;
  addFriendModalRef?: React.RefObject<BottomSheetModal>;
  navigation?: any;
}

export function withBottomSheet<P extends WithBottomSheetProps>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function WithBottomSheetComponent(componentProps: P) {
    const {bottomModalRef, initialIndex, snapPointsArr, ...restProps} = componentProps;

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          {...props}
        />
      ),
      [],
    );

    return (
      <Portal hostName="bottomSheetPortal">
        <BottomSheetModal
          ref={bottomModalRef}
          index={initialIndex}
          snapPoints={snapPointsArr}
          enablePanDownToClose={true}
          handleIndicatorStyle={{backgroundColor: '#000'}}
          backdropComponent={renderBackdrop}>
            <WrappedComponent {...componentProps} {...restProps}/>
        </BottomSheetModal>
      </Portal>
    );
  };
}
