import React from 'react';
import TextAreaComponent from '../../output_types/text_area_type/TextAreaType';
import TextComponent from '../../output_types/text_type/TextType';
import FileUploadComponent from '../../input_types/file_upload/FileUpload';
import FileComponent from '../../output_types/file/File';

function OutputComponent(props) {
    const { outputComponent } = props;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {outputComponent?.map((component) =>
                component?.components.map((c) => {
                    switch (c.component_type) {
                        case 'paragraph':
                            return (
                                <div
                                    style={{
                                        gridColumn: c.column_order,
                                        gridRow: component.row_order,
                                    }}
                                >
                                    <TextAreaComponent
                                        component_name={c.component_name}
                                        component_value={c.component_value}
                                    />
                                </div>
                            );
                        case 'singleline':
                            return (
                                <div
                                    style={{
                                        gridColumn: c.column_order,
                                        gridRow: component.row_order,
                                    }}
                                >
                                    <TextComponent
                                        component_name={c.component_name}
                                        component_value={c.component_value}
                                    />
                                </div>
                            );
                        case 'fileupload':
                            return (
                                <div
                                    style={{
                                        gridColumn: c.column_order,
                                        gridRow: component.row_order,
                                    }}
                                >
                                    <FileUploadComponent
                                        key={c.component_name}
                                        filename={c.filename}
                                        documentUrl={c.document_url}
                                        supportedFormats={c.supported_file_formats}
                                    />
                                </div>
                            );
                        case 'file':
                            return (
                                <div
                                    style={{
                                        gridColumn: c.column_order,
                                        gridRow: component.row_order,
                                    }}
                                >
                                    <FileComponent
                                        key={c.component_name}
                                        filename={c.filename}
                                        documentUrl={c.document_url}
                                        supportedFormats={c.supported_file_formats}
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
}

export default OutputComponent;
