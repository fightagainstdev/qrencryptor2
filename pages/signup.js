import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, query, where, getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../src/config/Firebase';
import { TextField, Button, Container, Typography, Link } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(8),
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Signup = () => {
  const classes = useStyles();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      setError('Please fill in all fields');
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    // Basic username validation (alphanumeric, 3-20 chars)
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setError('Username must be 3-20 alphanumeric characters');
      return;
    }
    // Basic password validation (at least 6 chars)
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Check if username exists
      const q = query(collection(db, 'users'), where('username', '==', username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError('Username already exists');
        return;
      }
      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Add user to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        createdAt: new Date(),
      });
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Typography component="h1" variant="h5">
        Sign Up
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
        <Link href="/login" variant="body2">
          {"Already have an account? Log In"}
        </Link>
      </form>
    </Container>
  );
};

export default Signup;

export async function getStaticProps() {
  return {
    props: {},
  };
}