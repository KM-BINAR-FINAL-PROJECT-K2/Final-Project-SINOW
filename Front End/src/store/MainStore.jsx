/* eslint-disable react/prop-types */

import LoaderContextProvider from "./Loader.jsx";
import ErrorContextProvider from "./Error.jsx";
import QueryContextProvider from "./QuerySearch.jsx";
import ClassContextProvider from "./ClassStore.jsx";
import RandomNumberContextProvider from "./RandomNumber.jsx";
import FilterClassContextProvider from "./FilterClass.jsx";
import CategoryContainerContextProvider from "./CategoryUI.jsx";
import NotificationDataContextProvider from "./NotificationData.jsx";
import AddNotificationContextProvider from "./ShowAddNotification.jsx";

const MainContextProvider = ({ children }) => (
  <LoaderContextProvider>
    <QueryContextProvider>
      <ErrorContextProvider>
        <ClassContextProvider>
          <FilterClassContextProvider>
            <RandomNumberContextProvider>
              <CategoryContainerContextProvider>
                <NotificationDataContextProvider>
                  <AddNotificationContextProvider>
                    {children}
                  </AddNotificationContextProvider>
                </NotificationDataContextProvider>
              </CategoryContainerContextProvider>
            </RandomNumberContextProvider>
          </FilterClassContextProvider>
        </ClassContextProvider>
      </ErrorContextProvider>
    </QueryContextProvider>
  </LoaderContextProvider>
);

export default MainContextProvider;
