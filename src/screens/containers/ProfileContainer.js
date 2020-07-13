import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import Icon from '../../assets/components/Icon';
import ProfileComponent from '../components/ProfileComponent';
import { GET_PROFILE } from '../../graphQL/query';

const ProfileContainer = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ paddingHorizontal: 20 }}>
          <Icon name="Config" width={40} height={40} />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.pop()} style={{ paddingHorizontal: 20 }}>
          <Icon name="Back" width={40} height={40} />
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  const { data, loading: loadingQuery } = useQuery(GET_PROFILE);

  return (
    <ProfileComponent
      profile={data?.profile}
      loading={loadingQuery}
      onPressEditButton={() => navigation.navigate('ProfileEdition')}
    />
  );
};

ProfileContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    pop: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired
  }).isRequired
};

export default ProfileContainer;