import AddClassContextProvider from "./AddClassUI";
import KeyContextProvider from "./ActiveKey";
import RemoveClassContextProvider from "./RemoveClassUI";
import InfoClassContextProvider from "./InfoClassUI";
import RotateContextProvider from "./RotateAction";
import FilterClassContextProvider from "./FilterClass";

const ManageClassContextProvider = ({ children }) => (
  <AddClassContextProvider>
    <KeyContextProvider>
      <RemoveClassContextProvider>
        <InfoClassContextProvider>
          <RotateContextProvider>
            <FilterClassContextProvider>{children}</FilterClassContextProvider>
          </RotateContextProvider>
        </InfoClassContextProvider>
      </RemoveClassContextProvider>
    </KeyContextProvider>
  </AddClassContextProvider>
);

export default ManageClassContextProvider;
