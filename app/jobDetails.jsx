import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const JobDetails = () => {
  const route = useRoute();
  const { id } = route.params || {};
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
// useEffect(() => {
//       const fetchJobDetails = async () => {
//         setLoading(true);
//         if (!id) {
//           setError('No job ID provided');
//           setLoading(false);
//           return;
//         }
    
//         try {
//           const response = await axios.get('https://testapi.getlokalapp.com/common/jobs');
//           const jobs = response.data.results;
    
//           console.log('Requested Job ID:', id); 
//           console.log('All job IDs:', jobs.map(job => job.id)); 
    
          
//   let convertedID =  parseInt(id)
//           const foundJob = jobs.find(j => j.id === convertedID);
       
//           console.log('Found Job:', foundJob); 
//           if (foundJob) {
//             setJob(foundJob);
//             setError(null); 
//           } else {
//             setError(`Job not found with ID: ${id}`);
//           }
//         } catch (err) {
//           setError(err.message);
//         } finally {
//           setLoading(false);
//         }
//       };
    
//       fetchJobDetails();
//     }, [id]);
    
useEffect(() => {
      const fetchJobDetails = async () => {
        setLoading(true);
        if (!id) {
          setError('No job ID provided');
          setLoading(false);
          return;
        }
  
        try {
          const allJobs = [];
          let page = 1;
          let hasMorePages = true;
  
          while (hasMorePages) {
            const response = await axios.get(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
            const jobs = response.data.results;
  
            if (jobs.length > 0) {
              allJobs.push(...jobs);
              page += 1;
            } else {
              hasMorePages = false;
            }
          }
  
          const convertedID = parseInt(id);
          const foundJob = allJobs.find(j => j.id === convertedID);
  
          if (foundJob) {
            setJob(foundJob);
            setError(null);
          } else {
            setError(`Job not found with ID: ${id}`);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchJobDetails();
    }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No job details available.</Text>
      </View>
    );
  }

  const {
    title,
    company_name,
    primary_details: { Place, Salary, Experience, Qualification, Job_Type } = {},
    creatives,
    whatsapp_no,
    contentV3: { V3: additionalDetails } = {},
  } = job;

  return (
      <ScrollView style={styles.container}>
      <View style={styles.card}>
        {creatives && creatives.length > 0 && (
          <Image source={{ uri: creatives[0]?.file }} style={styles.image} />
        )}
        <Text style={styles.title}>{title || 'No Title'}</Text>
        <Text style={styles.subtitle}>Company: {company_name || 'No Company Name'}</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailText}>{Place || 'No Location'}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Salary:</Text>
          <Text style={styles.detailText}>{Salary || 'No Salary'}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Experience:</Text>
          <Text style={styles.detailText}>{Experience || 'No Experience'}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Qualification:</Text>
          <Text style={styles.detailText}>{Qualification || 'No Qualification'}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Job Type:</Text>
          <Text style={styles.detailText}>{Job_Type || 'No Job Type'}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Contact:</Text>
          <Text style={styles.detailText}>{whatsapp_no || 'No Contact'}</Text>
        </View>

        {additionalDetails && additionalDetails.map((detail, index) => (
          <View key={index} style={styles.additionalDetail}>
            <Text style={styles.additionalDetailTitle}>{detail.field_name || 'No Field Name'}</Text>
            <Text style={styles.additionalDetailText}>{detail.field_value || 'No Field Value'}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
      },
      card: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 20,
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
      },
      image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
      },
      subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        color: '#555',
      },
      detailsContainer: {
        marginBottom: 15,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        paddingBottom: 10,
        paddingHorizontal: 5,
      },
      detailLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
      },
      detailText: {
        fontSize: 16,
        color: '#666',
      },
      additionalDetail: {
        marginTop: 15,
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fafafa',
      },
      additionalDetailTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
      },
      additionalDetailText: {
        fontSize: 14,
        color: '#666',
      },
      errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      errorText: {
        fontSize: 16,
        color: 'red',
      },
    });
    

export default JobDetails;
