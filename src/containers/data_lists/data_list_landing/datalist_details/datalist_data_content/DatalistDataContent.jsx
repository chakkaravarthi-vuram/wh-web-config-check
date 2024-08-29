import React, { useEffect, useState } from 'react';
import { Skeleton } from '@workhall-pvt-lmt/wh-ui-library';
import Form from '../../../../form/Form';
import { MODULE_TYPES } from '../../../../../utils/Constants';
import { FORM_TYPE } from '../../../../form/Form.string';
import { getFormDetailsApi } from '../../../../../axios/apiService/form.apiService';
import { getSectionAndFieldsFromResponse } from '../../../../form/sections/form_layout/FormLayout.utils';
import { getAccountConfigurationDetailsApiService } from '../../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { getUserProfileData, setUserProfileData, somethingWentWrongErrorToast } from '../../../../../utils/UtilityFunctions';
import { setPointerEvent } from '../../../../../utils/loaderUtils';

function DatalistDataContent(props) {
    const {
        dataListID,
    } = props;

    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (dataListID) {
            // loaders to prevent user interacion when api is called
            // comments - split into 2 function if possible
            setIsLoading(true);
            setPointerEvent(true);
            const params = {
                data_list_id: dataListID,
            };
            getFormDetailsApi(params).then((data) => {
                // comments - Use the JS naming standardS
                const { sections, fields } = getSectionAndFieldsFromResponse(data.sections || []);
                const _formData = {
                    sections,
                    fields,
                    formUUID: data.form_uuid,
                    loading: false,
                    showSectionName: data?.show_section_name || false,
                };
                setFormData(_formData);
            }).catch((err) => {
                console.log('dl data tab getFormDetails err', err);
                somethingWentWrongErrorToast();
            }).finally(() => {
                // loaders reset
                setIsLoading(false);
                setPointerEvent(false);
            });

            // user profile data
            // comments - Handle error part

            getAccountConfigurationDetailsApiService().then((response) => {
                setUserProfileData(response);
            });
        }
    }, [dataListID]);

    return (
        <div>
            {/* comments - best practice to create as a function and rturn the comp instaes nesting in JSX */}
            {isLoading ?
                <Skeleton height={500} /> :
                <Form
                    moduleType={MODULE_TYPES.DATA_LIST}
                    saveField={null}
                    formType={FORM_TYPE.READ_ONLY_CREATION_FORM}
                    metaData={{
                        formUUID: formData?.formUUID,
                        moduleId: dataListID,
                    }}
                    sections={formData.sections || []}
                    fields={formData.fields}
                    onFormConfigUpdate={null}
                    showSectionName
                    userProfileData={getUserProfileData()}
                />}
        </div>
    );
}

export default DatalistDataContent;
