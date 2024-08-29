import { UPDATE_CATEGORY, DELETE_CATEGORY } from '../../urls/ApiUrls';
import { normalizeEditCategory, normalizeDeleteCategory } from '../apiNormalizer/category.apiNormalizer';
import { axiosPostUtils } from '../AxiosHelper';

  export const updateCategory = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_CATEGORY, data)
      .then((response) => {
        resolve(normalizeEditCategory(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

  export const deleteCategory = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_CATEGORY, data)
      .then((response) => {
        resolve(normalizeDeleteCategory(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
