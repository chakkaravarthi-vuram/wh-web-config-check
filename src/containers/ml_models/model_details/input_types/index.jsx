import React from 'react';
import TextAreaComponent from './text_area_type/TextAreaType';
import TextComponent from './text_type/TextType';
import FileUploadComponent from './file_upload/FileUpload';

const getInputComponent = (props) => {
    const { inputComponent, isTryIt, requestBody, onInputChange, errorBody, isClearData } = props;
    console.log('props', props);
    return (
        <div style={{ display: 'grid' }}>
            {inputComponent?.map((component) =>
                component?.components?.map((c) => {
                    switch (c.component_type) {
                        case 'paragraph':
                            if (isTryIt && c.component_name === 'Description') {
                                return null;
                            } else {
                                if (c.component_name === 'Description') {
                                    return (
                                        <div
                                            style={{
                                                gridColumn: c.column_order,
                                                gridRow: component.row_order,
                                                marginTop: '10px',
                                            }}
                                        >
                                            <TextComponent
                                                component_name={c.component_name}
                                                component_value={c.component_value}
                                            />
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div
                                            style={{
                                                gridColumn: c.column_order,
                                                gridRow: component.row_order,
                                                marginTop: '10px',
                                            }}
                                        >
                                            <TextAreaComponent
                                                component_name={c.component_name}
                                                component_value={c.component_value}
                                                isTryIt={isTryIt}
                                                onInputChange={onInputChange}
                                                requestBody={requestBody}
                                                requestKey={c?.key}
                                                errorBody={errorBody}
                                                isRequired={c.is_required}
                                                component={c}
                                            />
                                        </div>
                                    );
                                }
                            }
                        case 'fileupload':
                            return (
                                <div
                                    style={{
                                        gridColumn: c.column_order,
                                        gridRow: component.row_order,
                                        marginTop: '10px',
                                    }}
                                >
                                    <FileUploadComponent
                                        key={c.component_name}
                                        filename={c.filename}
                                        documentUrl={c.document_url}
                                        supported_file_formats={c.supported_file_formats}
                                        isTryIt={isTryIt}
                                        onInputChange={onInputChange}
                                        requestBody={requestBody}
                                        requestKey={c?.key}
                                        component={c}
                                        isClearData={isClearData}
                                        errorBody={errorBody}
                                    />
                                </div>
                            );
                        default:
                            return null;
                    }
                }),
            )}
        </div>
    );
};

export default getInputComponent;
