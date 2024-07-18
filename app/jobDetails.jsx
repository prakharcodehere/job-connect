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

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://testapi.getlokalapp.com/common/jobs/${id}`);
        console.log('API Response:', response.data);

        if (response.data) {
          setJob(response.data);
        } else {
          setError(`Job not found with ID: ${id}`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
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
    primary_details: { Place, Salary, Experience, Qualification, Job_Type } = {},
    whatsapp_no,
    company_name,
    creatives,
    contentV3: { V3: additionalDetails } = {},
  } = job;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {creatives && creatives.length > 0 && (
        <Image source={{ uri: creatives[0]?.file }} style={styles.image} />
      )}
      <Text style={styles.title}>{title || 'No Title'}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>Company: {company_name || 'No Company Name'}</Text>
        <Text style={styles.detail}>Location: {Place || 'No Location'}</Text>
        <Text style={styles.detail}>Salary: {Salary || 'No Salary'}</Text>
        <Text style={styles.detail}>Experience: {Experience || 'No Experience'}</Text>
        <Text style={styles.detail}>Qualification: {Qualification || 'No Qualification'}</Text>
        <Text style={styles.detail}>Job Type: {Job_Type || 'No Job Type'}</Text>
        <Text style={styles.detail}>Contact: {whatsapp_no || 'No Contact'}</Text>
      </View>
      {additionalDetails && additionalDetails.map((detail, index) => (
        <View key={index} style={styles.detailContainer}>
          <Text style={styles.detailTitle}>{detail.field_name || 'No Field Name'}</Text>
          <Text style={styles.detailValue}>{detail.field_value || 'No Field Value'}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: 20,
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
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
  detailContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default JobDetails;
