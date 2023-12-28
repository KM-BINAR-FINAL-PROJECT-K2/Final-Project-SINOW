/* eslint-disable react/prop-types */
import AddClassContextProvider from "./AddClassUI";
import KeyContextProvider from "./ActiveKey";
import RemoveClassContextProvider from "./RemoveClassUI";
import InfoClassContextProvider from "./InfoClassUI";
import RotateContextProvider from "./RotateAction";
import SearchValueContextProvider from "./SearchValue";
import CategoryContainerContextProvider from "./CategoryUI";

const ManageClassContextProvider = ({ children }) => (
  <AddClassContextProvider>
    <KeyContextProvider>
      <RemoveClassContextProvider>
        <InfoClassContextProvider>
          <RotateContextProvider>
            <SearchValueContextProvider>
              <CategoryContainerContextProvider>
                {children}
              </CategoryContainerContextProvider>
            </SearchValueContextProvider>
          </RotateContextProvider>
        </InfoClassContextProvider>
      </RemoveClassContextProvider>
    </KeyContextProvider>
  </AddClassContextProvider>
);

export default ManageClassContextProvider;
