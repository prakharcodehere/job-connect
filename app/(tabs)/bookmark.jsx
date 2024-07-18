import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
      const loadBookmarks = async () => {
        try {
          const storedBookmarks = await AsyncStorage.getItem('bookmarks');
          if (storedBookmarks) {
            setBookmarks(JSON.parse(storedBookmarks));
          } else {
            setBookmarks([]);
          }
          setLoading(false);
        } catch (error) {
         
          setLoading(false);
        }
      };
    
      loadBookmarks();
    }, [bookmarks]);
    
    

  const removeFromBookmarks = async (jobId) => {
    try {
      const storedBookmarks = await AsyncStorage.getItem('bookmarks');
      let bookmarksArray = storedBookmarks ? JSON.parse(storedBookmarks) : [];

   
      bookmarksArray = bookmarksArray.filter(job => job.id !== jobId);

      await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarksArray));

      
      setBookmarks([...bookmarksArray]); 
    } catch (error) {
      console.error('Error removing bookmark', error);
    }
  };

  const renderBookmark = ({ item }) => (
      <View style={styles.jobCard}>
        <TouchableOpacity onPress={() => navigation.navigate('jobDetails', { id: item.id })}>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobLocation}>Location: {item.primary_details?.Place || 'No Location'}</Text>
            <Text style={styles.jobSalary}>Salary: {item.primary_details?.Salary || 'No Salary'}</Text>
            <Text style={styles.jobPhone}>Contact: {item.whatsapp_no || 'No Contact'}</Text>
            <TouchableOpacity onPress={() => removeFromBookmarks(item.id)} style={styles.removeButton}>
              <Ionicons name="trash" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No bookmarks available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bookmarks}
      renderItem={renderBookmark}
      keyExtractor={(item) => item.id ? item.id.toString() : item.title} // Adjust keyExtractor as needed
    />
  );
};

// const styles = StyleSheet.create({
//   jobCard: {
//     backgroundColor: '#fff',
//     padding: 30,
//     marginVertical: 10,
//     marginHorizontal: 20,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 5,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   jobInfo: {
//     flex: 1,
//   },
//   jobTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   jobLocation: {
//     fontSize: 14,
//     marginBottom: 5,
//   },
//   jobSalary: {
//     fontSize: 14,
//     marginBottom: 5,
//   },
//   jobPhone: {
//     fontSize: 14,
//     color: 'blue',
//   },
//   removeButton: {
//     backgroundColor: '#ff0000',
//     padding: 6,
//     borderRadius: 10,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

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
      jobInfo: {
        flexDirection: 'column',
        justifyContent: 'space-between',
      },
      jobTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      jobLocation: {
        fontSize: 16,
        marginBottom: 5,
      },
      jobSalary: {
        fontSize: 16,
        marginBottom: 5,
      },
      jobPhone: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 10,
      },
      removeButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#ff0000',
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    });
    

export default Bookmark;
