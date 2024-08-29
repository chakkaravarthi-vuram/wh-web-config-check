import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack5';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

function PdfRenderer({ fileSrc, scaleValue, isCustomPDF, withCredentials }) {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const getPDFPages = () =>
    Array(numPages)
      .fill()
      .map((_, index) => <Page scale={scaleValue} pageNumber={index + 1} />);

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, [containerRef]);

  return (
    <div>
      {isCustomPDF ? (
        <div style={{ overflowY: 'auto', overflowX: 'hidden', height: '200px' }} ref={containerRef}>
        <Document file={fileSrc} onLoadSuccess={onDocumentLoadSuccess} options={{ withCredentials: withCredentials }}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={containerWidth}
              height={500}
            />
          ))}
        </Document>
        </div>

      ) : (
        <Document
        file={fileSrc}
        onLoadSuccess={onDocumentLoadSuccess}
        options={{ withCredentials: withCredentials }}
        >
        {getPDFPages()}
        </Document>
      )}
    </div>
  );
}

export default PdfRenderer;
