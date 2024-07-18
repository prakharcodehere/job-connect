import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JobsScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    fetchJobs();
    loadBookmarks(); // Load bookmarks on component mount
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

  const addToBookmarks = async (job) => {
    try {
      const storedBookmarks = await AsyncStorage.getItem('bookmarks');
      let bookmarksArray = storedBookmarks ? JSON.parse(storedBookmarks) : [];
  
      bookmarksArray.push(job);
  
      await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarksArray));
  
      setBookmarks(prevBookmarks => [...prevBookmarks, job]); // Update state
    } catch (error) {
      console.error('Error saving bookmarks', error);
    }
  };
  
  const removeFromBookmarks = async (jobId) => {
    try {
      const storedBookmarks = await AsyncStorage.getItem('bookmarks');
      const bookmarksArray = storedBookmarks ? JSON.parse(storedBookmarks) : [];
      const updatedBookmarks = bookmarksArray.filter(job => job.id !== jobId);
  
      await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  
      setBookmarks(updatedBookmarks); // Update state
    } catch (error) {
      console.error('Error removing bookmark', error);
    }
  };

  const loadBookmarks = async () => {
    try {
      const storedBookmarks = await AsyncStorage.getItem('bookmarks');
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
    } catch (error) {
      console.error('Error loading bookmarks', error);
    }
  };

  const isBookmarked = (jobId) => {
    return bookmarks.some(job => job.id === jobId);
  };

  const toggleBookmark = (job) => {
    if (isBookmarked(job.id)) {
      removeFromBookmarks(job.id);
    } else {
      addToBookmarks(job);
    }
  };

  const renderJob = ({ item }) => {
    const place = item.primary_details && item.primary_details.Place ? item.primary_details.Place : 'Unknown';
    const salary = item.primary_details && item.primary_details.Salary ? item.primary_details.Salary : 'Salary not specified';

    return (
      <TouchableOpacity onPress={() => router.push({ pathname: 'jobDetails', params: { id: item.id } })}>
        <View style={styles.jobCard}>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobLocation}>Location: {place}</Text>
            <Text style={styles.jobSalary}>Salary: {salary}</Text>
            <Text style={styles.jobPhone}>Contact: {item.whatsapp_no}</Text>
          </View>
          <TouchableOpacity onPress={() => toggleBookmark(item)} style={styles.bookmarkButton}>
            <Ionicons name={isBookmarked(item.id) ? 'bookmark' : 'bookmark-outline'} size={24} color="#fff" />
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
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
  bookmarkButton: {
    backgroundColor: '#00c562',
    padding: 10,
    borderRadius: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default JobsScreen;
