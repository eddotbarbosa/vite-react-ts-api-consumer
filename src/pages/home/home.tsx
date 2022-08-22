import layout from '../../styles/layout.module.scss';

import {SignInUp} from '../../components/signInUp/signInUp';

const Home = function () {
  return (
    <main className={`${layout['container-screen']} ${layout['flex']} ${layout['justify-center']} ${layout['align-center']}`}>
      <SignInUp />
    </main>
  );
};

export {Home};
