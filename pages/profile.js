import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../src/config/Firebase';
import {
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    width: '100%',
    maxWidth: 600,
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginBottom: theme.spacing(2),
  },
  uploadButton: {
    marginTop: theme.spacing(1),
  },
  vaultItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const Profile = () => {
  const classes = useStyles();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ username: '', email: '', avatar: '', passwords: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [newPasswordName, setNewPasswordName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData({ username: '', email: '', avatar: '', passwords: [], ...userDoc.data() });
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleAvatarUpload = async () => {
    if (!avatarFile || !user) return;
    const storageRef = ref(storage, `avatars/${user.uid}`);
    try {
      await uploadBytes(storageRef, avatarFile);
      const downloadURL = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'users', user.uid), { avatar: downloadURL });
      setUserData({ ...userData, avatar: downloadURL });
      setAvatarFile(null);
    } catch (err) {
      setError('Failed to upload avatar');
    }
  };

  const handleAddPassword = async () => {
    if (!newPasswordName || !newPassword || (userData.passwords || []).length >= 5) return;
    const existingNames = (userData.passwords || []).map(p => p.name);
    if (existingNames.includes(newPasswordName)) {
      setError('Password name must be unique');
      return;
    }
    const updatedPasswords = [...(userData.passwords || []), { name: newPasswordName, password: newPassword }];
    try {
      await updateDoc(doc(db, 'users', user.uid), { passwords: updatedPasswords });
      setUserData({ ...userData, passwords: updatedPasswords });
      setNewPasswordName('');
      setNewPassword('');
      setAddDialogOpen(false);
    } catch (err) {
      setError('Failed to add password');
    }
  };

  const handleDeletePassword = async (index) => {
    const updatedPasswords = (userData.passwords || []).filter((_, i) => i !== index);
    try {
      await updateDoc(doc(db, 'users', user.uid), { passwords: updatedPasswords });
      setUserData({ ...userData, passwords: updatedPasswords });
    } catch (err) {
      setError('Failed to delete password');
    }
  };

  const handleEditPassword = (index) => {
    const pwd = (userData.passwords || [])[index];
    setEditIndex(index);
    setEditName(pwd.name);
    setEditPassword(pwd.password);
    setEditDialogOpen(true);
  };

  const handleUpdatePassword = async () => {
    if (!editName || !editPassword) return;
    const existingNames = (userData.passwords || []).map((p, i) => i !== editIndex ? p.name : null).filter(Boolean);
    if (existingNames.includes(editName)) {
      setError('Password name must be unique');
      return;
    }
    const updatedPasswords = [...(userData.passwords || [])];
    updatedPasswords[editIndex] = { name: editName, password: editPassword };
    try {
      await updateDoc(doc(db, 'users', user.uid), { passwords: updatedPasswords });
      setUserData({ ...userData, passwords: updatedPasswords });
      setEditDialogOpen(false);
      setEditIndex(null);
      setEditName('');
      setEditPassword('');
    } catch (err) {
      setError('Failed to update password');
    }
  };

  const handleCopyPassword = async (password) => {
    try {
      await navigator.clipboard.writeText(password);
      // Optionally, show a snackbar or alert
    } catch (err) {
      setError('Failed to copy password');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!user) return null;

  return (
    <Container component="main" maxWidth="md" className={classes.container}>
      <Typography component="h1" variant="h4" gutterBottom>
        User Profile
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom>Profile Information</Typography>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar src={userData.avatar} className={classes.avatar} />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
            style={{ display: 'none' }}
            id="avatar-upload"
          />
          <label htmlFor="avatar-upload">
            <Button variant="contained" component="span" className={classes.uploadButton}>
              Choose Avatar
            </Button>
          </label>
          {avatarFile && (
            <Button onClick={handleAvatarUpload} variant="contained" color="primary">
              Upload Avatar
            </Button>
          )}
        </Box>
        <TextField
          label="Username"
          value={userData.username}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Email"
          value={userData.email}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />
      </Paper>

      <Paper className={classes.paper}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
           <Typography variant="h6">Password Vault ({(userData.passwords || []).length}/5)</Typography>
           {(userData.passwords || []).length < 5 && (
             <IconButton onClick={() => setAddDialogOpen(true)}>
               <AddIcon />
             </IconButton>
           )}
         </Box>
         <List>
           {(userData.passwords || []).map((pwd, index) => (
             <ListItem key={index} className={classes.vaultItem}>
               <ListItemText primary={pwd.name} secondary={`Password: ${pwd.password}`} />
               <IconButton onClick={() => handleCopyPassword(pwd.password)}>
                 <FileCopyIcon />
               </IconButton>
               <IconButton onClick={() => handleEditPassword(index)}>
                 <EditIcon />
               </IconButton>
               <IconButton onClick={() => handleDeletePassword(index)}>
                 <DeleteIcon />
               </IconButton>
             </ListItem>
           ))}
         </List>
      </Paper>

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={newPasswordName}
            onChange={(e) => setNewPasswordName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddPassword} color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdatePassword} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};
export default Profile;

export async function getStaticProps() {
  return {
    props: {},
  };
}