import React, {useEffect, useState} from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeBook] = useMutation(DELETE_BOOK);
  const [initialData, setData]=useState([]);
  const userData = data?.me || {};

  
  function refreshPage() {
    window.location.reload(false);
  }
  

  console.log(initialData)
  console.log(data)
  console.log(userData)

    // use this to determine if `useEffect()` hook needs to run again
    // const userDataLength = Object.keys(userData).length;
    // const userDataLength=data.savedBooks
  
    useEffect(() => {
      console.log("useEffect ran")
      const getUserData = async () => {
        console.log("getUserData ran")
        try {
          const token = Auth.loggedIn() ? Auth.getToken() : null;
          
  
          if (!token) {
            return false;
          }
          setData(data)
          
         // const response = await getMe(token);
  
    //       // const user = await response.json();
    //       // const user = await useQuery(QUERY_ME);
        } catch (err) {
          console.error(err);
        }
      };
  
      getUserData();
      console.log(initialData)
      

      //data is the rerun condition
   }, [data]);

   if(loading){
    return <h1>loading</h1>
  }

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId: bookId }
      });
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
      refreshPage();
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
