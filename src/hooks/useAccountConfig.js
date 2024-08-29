import { useEffect, useState } from 'react';
import { getAccountConfigurationDetailsApiService } from '../axios/apiService/accountConfigurationDetailsAdmin.apiService';

function useAccountConfig() {
  const [userProfileData, setUserProfileData] = useState({});
  useEffect(() => {
    getAccountConfigurationDetailsApiService().then((response) => {
      setUserProfileData(response);
    });
  }, []);
  return userProfileData;
}

export default useAccountConfig;
