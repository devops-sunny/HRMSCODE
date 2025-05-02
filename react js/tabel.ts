import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink, pdf } from '@react-pdf/renderer';

// Define styles for PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'darkgreen',
    textDecoration: 'underline',
  },
  governmentHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: 'navy',
  },
  departmentHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: 'navy',
  },
  formNumber: {
    position: 'absolute',
    top: 30,
    right: 30,
    fontSize: 10,
  },
  certificateNumber: {
    position: 'absolute',
    top: 30,
    left: 30,
    fontSize: 10,
  },
  intro: {
    fontSize: 10,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  column: {
    flex: 1,
    paddingRight: 10,
  },
  fieldName: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  fieldValue: {
    fontSize: 10,
  },
  footer: {
    marginTop: 30,
    fontSize: 10,
  },
  qrCode: {
    width: 80,
    height: 80,
    marginTop: 30,
  },
  signature: {
    marginTop: 30,
    fontSize: 10,
    textAlign: 'right',
  },
  legalText: {
    fontSize: 9,
    marginTop: 20,
  },
  reminder: {
    fontSize: 9,
    marginTop: 10,
  },
});

// Create the Birth Certificate PDF Document
const BirthCertificatePDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.certificateNumber}>No.1</Text>
      <Text style={styles.formNumber}>Form-7</Text>
      
      <View style={styles.header}>
        <Text style={styles.governmentHeader}>GOVERNMENT OF CITY A</Text>
        <Text style={styles.departmentHeader}>DEPARTMENT OF HEALTH AND FAMILY WELFARE</Text>
        <Text style={styles.header}>Chief Registrar Births & Deaths, City A</Text>
        <Text style={styles.title}>BIRTH CERTIFICATE</Text>
      </View>
      
      <Text style={styles.intro}>
        This is to certify that the following information has been taken from the original birth record which is
        registered in the birth register of Local Registrar, Births & Deaths, Kota, Block/ Police Station- mayur
        vihar Tehsil- gumanpura District - ladpura of Rajasthan State of the Year – 2022
      </Text>
      
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.fieldName}>NAME:</Text>
          <Text style={styles.fieldValue}>chinna gubbu</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.fieldName}>SEX:</Text>
          <Text style={styles.fieldValue}>Male</Text>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.fieldName}>DATE OF BIRTH:</Text>
          <Text style={styles.fieldValue}>04/05/2022</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.fieldName}>PLACE OF BIRTH:</Text>
          <Text style={styles.fieldValue}>hospital</Text>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.fieldName}>NAME OF MOTHER:</Text>
          <Text style={styles.fieldValue}>Beena Mittal</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.fieldName}>NAME OF FATHER:</Text>
          <Text style={styles.fieldValue}>Rakesh Mittal</Text>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.fieldName}>ADDRESS OF PARENTS AT THE TIME OF BIRTH OF THE CHILD:</Text>
          <Text style={styles.fieldValue}>4334 4434 mayur vihar azad nagar gumanpura ladpura Kota Rajasthan 560090 India</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.fieldName}>PERMANENT ADDRESS OF PARENTS:</Text>
          <Text style={styles.fieldValue}>4334 4434 mayur vihar azad nagar gumanpura ladpura Kota Rajasthan 560090 India</Text>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.fieldName}>REGISTRATION NUMBER:</Text>
          <Text style={styles.fieldValue}>545454dd</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.fieldName}>DATE OF REGISTRATION:</Text>
          <Text style={styles.fieldValue}>13/05/2022</Text>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.fieldName}>REMARKS (IF ANY):</Text>
          <Text style={styles.fieldValue}>NA</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.fieldName}>DATE OF ISSUE:</Text>
          <Text style={styles.fieldValue}>18/05/2022</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          {/* Placeholder for QR code. In a real application, you would generate this */}
          <View style={styles.qrCode}></View>
        </View>
        <View style={styles.column}>
          <Text style={styles.signature}>Signature, Name & address of issuing Authority Kota</Text>
        </View>
      </View>
      
      <Text style={styles.legalText}>
        Issued Under Section 12/17 of the Registration of Births and Deaths Act, 1969 and Rule 8/13 the
        Registration of Births and Deaths Rules,2004
      </Text>
      
      <Text style={styles.reminder}>Ensure registration of every birth and death.</Text>
      <Text style={styles.reminder}>Register the Births / Deaths event within 21 Days and get a free copy.</Text>
    </Page>
  </Document>
);

// Create the actual React component for the application
const BirthCertificateApp = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const handleDownload = async () => {
    setIsLoading(true);
    const blob = await pdf(<BirthCertificatePDF />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'birth-certificate.pdf';
    link.click();
    URL.revokeObjectURL(url);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-6">Birth Certificate Viewer</h1>
      
      <div className="flex gap-4 mb-6">
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" 
          onClick={handleDownload}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Download PDF'}
        </button>
        
        <PDFDownloadLink 
          document={<BirthCertificatePDF />} 
          fileName="birth-certificate.pdf"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {({ loading }) => (loading ? 'Preparing document...' : 'Direct Download')}
        </PDFDownloadLink>
      </div>
      
      <div className="w-full border border-gray-300 rounded overflow-hidden" style={{ height: '70vh' }}>
        <PDFViewer width="100%" height="100%">
          <BirthCertificatePDF />
        </PDFViewer>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>This PDF is rendered using react-pdf library and matches the original birth certificate format.</p>
        <p>You can download this certificate or view it directly in the browser.</p>
      </div>
    </div>
  );
};

export default BirthCertificateApp;



