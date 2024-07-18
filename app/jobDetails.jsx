import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const JobDetails = () => {
  const router = useRouter();
  const { job } = router.query;

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
  } = job;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Location: {Place}</Text>
      <Text style={styles.text}>Salary: {Salary}</Text>
      <Text style={styles.text}>Experience: {Experience}</Text>
      <Text style={styles.text}>Qualification: {Qualification}</Text>
      <Text style={styles.text}>Job Type: {Job_Type}</Text>
      <Text style={styles.text}>Contact: {whatsapp_no}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default JobDetails;
