/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const NotificationDataContext = createContext();

const NotificationDataContextProvider = ({ children }) => {
  const [notificationData, setNotificationData] = useState(false);

  return (
    <NotificationDataContext.Provider
      value={{ notificationData, setNotificationData }}
    >
      {children}
    </NotificationDataContext.Provider>
  );
};

export default NotificationDataContextProvider;
