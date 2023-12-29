/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const AddNotificationContext = createContext();
const AddNotificationContextProvider = ({ children }) => {
  const [showAddNotification, setShowAddNotification] = useState(false);

  return (
    <AddNotificationContext.Provider
      value={{ showAddNotification, setShowAddNotification }}
    >
      {children}
    </AddNotificationContext.Provider>
  );
};

export default AddNotificationContextProvider;
