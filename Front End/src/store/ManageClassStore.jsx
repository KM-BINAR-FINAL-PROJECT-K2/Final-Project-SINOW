/* eslint-disable react/prop-types */
import AddClassContextProvider from "./AddClassUI";
import KeyContextProvider from "./ActiveKey";
import RemoveClassContextProvider from "./RemoveClassUI";
import InfoClassContextProvider from "./InfoClassUI";
import RotateContextProvider from "./RotateAction";
import SearchValueContextProvider from "./SearchValue";

const ManageClassContextProvider = ({ children }) => (
  <AddClassContextProvider>
    <KeyContextProvider>
      <RemoveClassContextProvider>
        <InfoClassContextProvider>
          <RotateContextProvider>
            <SearchValueContextProvider>{children}</SearchValueContextProvider>
          </RotateContextProvider>
        </InfoClassContextProvider>
      </RemoveClassContextProvider>
    </KeyContextProvider>
  </AddClassContextProvider>
);

export default ManageClassContextProvider;
