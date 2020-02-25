import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ImagePicker from 'react-native-image-picker';
import reactotron from 'reactotron-react-native';
import CreateProfileComponent from '../components/CreateProfileComponent';
import DropDownHolder from '../../helpers/DropDownHolder';

const GET_USER = gql`
  query {
    user {
      name
    }
    profile {
      images {
        _id
        image
      }
    }
  }
`;

const CREATE_PROFILE = gql`
  mutation($file: String, $name: String, $birthday: String) {
    createProfile(file: $file, name: $name, birthday: $birthday) {
      _id
      images {
        _id
        image
      }
    }
  }
`;

const CreateProfileContainer = ({ navigation }) => {
  const [state, setState] = useState({
    birthday: '07-03-1994 08:45:00',
    file: null,
    avatar: '//'
  });

  const { birthday, file } = state;
  const { loading: queryLoading, data } = useQuery(GET_USER);
  const [createProfile, { loading: mutationLoading }] = useMutation(CREATE_PROFILE, {
    onCompleted: () => navigation.replace('Chat'),
    onError: () => DropDownHolder.show('error', '', 'Falha ao criar perfil'),
    refetchQueries: [{ query: GET_USER, variables: { v: Math.random() } }]
  });
  const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
      cameraRoll: true,
      waitUntilSaved: true
    }
  };

  const picker = () =>
    ImagePicker.showImagePicker(options, response => {
      const path = response.uri;
      reactotron.log(path);
      setState({
        ...state,
        file: response.data,
        avatar: path.replace('file//', '')
      });
    });

  const { user, profile } = data || {};

  return (
    <CreateProfileComponent
      isLoading={queryLoading || mutationLoading}
      onPressSubmit={() =>
        createProfile({
          variables: {
            name: data.user.name,
            birthday,
            file
          }
        })
      }
      onPressUpload={() => picker()}
      user={user}
      profile={profile}
      image={state.avatar}
    />
  );
};

export default CreateProfileContainer;