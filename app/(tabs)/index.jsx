import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

const JobsScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
      setJobs(prevJobs => [...prevJobs, ...response.data.results]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };




  const renderJob = ({ item, navigation }) => {
    
    const place = item.primary_details && item.primary_details.Place ? item.primary_details.Place : 'Unknown';
    const salary = item.primary_details && item.primary_details.Salary ? item.primary_details.Salary : 'Salary not specified';
  
    return (
      <TouchableOpacity onPress={() => router.push({ pathname: 'jobDetails', params: { job: item } })}>
        <View style={styles.jobCard}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.jobLocation}>Location: {place}</Text>
          <Text style={styles.jobSalary}>Salary: {salary}</Text>
          <Text style={styles.jobPhone}>Contact: {item.whatsapp_no}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleLoadMore = () => {
    if (!loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  if (loading && page === 1) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={jobs}
      renderItem={renderJob}
      keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
      ListEmptyComponent={!loading && !jobs.length ? <Text style={styles.emptyText}>No jobs found.</Text> : null}
    />
  );
};

const styles = StyleSheet.create({
  jobCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  jobLocation: {
    fontSize: 14,
    marginBottom: 5,
  },
  jobSalary: {
    fontSize: 14,
    marginBottom: 5,
  },
  jobPhone: {
    fontSize: 14,
    color: 'blue',
  },
});
export default JobsScreen;
