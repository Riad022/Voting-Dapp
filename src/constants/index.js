import { createVote, dashboard, logout, profile , register} from '../assets';


export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'create-vote',
    imgUrl: createVote,
    link: '/create-vote',
  },
  {
    name: 'RegisterVoters',
    imgUrl: register,
    link: '/RegisterVoters',
  },
  {
    name: 'VoterRight',
    imgUrl: profile,
    link: '/VoterRight',
  },
  {
    name: 'logout',
    imgUrl: logout,
    disabled: true,
  },
];
