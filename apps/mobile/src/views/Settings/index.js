import React, {useCallback, useEffect, useState} from 'react';
import {Linking, Platform, ScrollView, View} from 'react-native';
import {Button as MButton} from '../../components/Button/index';
import {ContainerTopSection} from '../../components/Container/ContainerTopSection';
import {Issue} from '../../components/Github/issue';
import {Header as TopHeader} from '../../components/Header/index';
import Seperator from '../../components/Seperator';
import Paragraph from '../../components/Typography/Paragraph';
import {useTracked} from '../../provider';
import {
  eSendEvent,
  presentSheet,
  ToastEvent
} from '../../services/EventManager';
import Navigation from '../../services/Navigation';
import {InteractionManager, STORE_LINK} from '../../utils';
import {APP_VERSION} from '../../../version';
import {db} from '../../utils/database';
import {eScrollEvent, eUpdateSearchState} from '../../utils/Events';
import {openLinkInBrowser} from '../../utils/functions';
import SettingsAppearanceSection from './appearance';
import SettingsBackupAndRestore from './backup-restore';
import {CustomButton} from './button';
import SettingsDeveloperOptions from './developeroptions';
import SettingsGeneralOptions from './general';
import AccoutLogoutSection from './logout';
import SettingsPrivacyAndSecurity from './privacy';
import SectionHeader from './section-header';
import SettingsUserSection from './user-section';
import {Update} from '../../components/Update';
import {checkVersion} from 'react-native-check-version';

const format = ver => {
  let parts = ver.toString().split('');

  return `v${parts[0]}.${parts[1]}.${
    parts[2]?.startsWith('0') ? parts[2]?.slice(1) : parts[2]
  }${parts[3] === '0' ? '' : parts[3]} `;
};

export const Settings = ({navigation}) => {
  const [state, dispatch] = useTracked();
  const {colors} = state;
  const [collapsed, setCollapsed] = useState(false);

  let pageIsLoaded = false;

  const onFocus = useCallback(() => {
    eSendEvent(eUpdateSearchState, {
      placeholder: '',
      data: [],
      noSearch: true,
      type: '',
      color: null
    });

    if (!pageIsLoaded) {
      pageIsLoaded = true;
      return;
    }
    Navigation.setHeaderState(
      'Settings',
      {
        menu: true
      },
      {
        heading: 'Settings',
        id: 'settings_navigation'
      }
    );
  }, []);

  // const checkAppUpdateAvailable = async () => {
  //   try {
  //     const version = await checkVersion();
  //     if (!version.needsUpdate) {
  //       ToastEvent.show({
  //         heading: 'You are on the latest version',
  //         type: 'success'
  //       });
  //       return false;
  //     }
  //     presentSheet({
  //       noIcon: true,
  //       noProgess: true,
  //       component: ref => <Update version={version} fwdRef={ref} />
  //     });
  //     return true;
  //   } catch (e) {
  //     ToastEvent.show({
  //       heading: 'You are on the latest version',
  //       type: 'success'
  //     });
  //     return false;
  //   }
  // };

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      navigation.addListener('focus', onFocus);
    });

    return () => {
      pageIsLoaded = false;
      navigation.removeListener('focus', onFocus);
    };
  }, []);

  const otherItems = [
    {
      name: 'Terms of service',
      func: async () => {
        try {
          await openLinkInBrowser('https://notesnook.com/tos', colors);
        } catch (e) {}
      },
      desc: 'Read our terms of service'
    },
    {
      name: 'Privacy policy',
      func: async () => {
        try {
          await openLinkInBrowser('https://notesnook.com/privacy', colors);
        } catch (e) {}
      },
      desc: 'Read our privacy policy'
    },
    {
      name: `Report an issue`,
      func: async () => {
        presentSheet({
          noIcon: true,
          component: <Issue />
        });
      },
      desc: `Facing an issue? Click here to create a bug report`
    },
    {
      name: 'Join our Discord community',

      func: async () => {
        presentSheet({
          title: 'Join our Discord Community',
          iconColor: 'discord',
          paragraph:
            'We are not ghosts, chat with us and share your experience.',
          valueArray: [
            'Talk with us anytime.',
            'Follow the development process',
            'Give suggestions and report issues.',
            'Get early access to new features',
            'Meet other people using Notesnook'
          ],
          noProgress: true,
          icon: 'discord',
          action: async () => {
            try {
              await openLinkInBrowser('https://discord.gg/zQBK97EE22', colors);
            } catch (e) {}
          },
          actionText: 'Join Now'
        });
      },
      desc: 'We are not ghosts, chat with us and share your experience.'
    },
    {
      name: 'Download on desktop',
      func: async () => {
        try {
          await openLinkInBrowser('https://notesnook.com', colors);
        } catch (e) {}
      },
      desc: 'Notesnook app can be downloaded on all platforms'
    },
    {
      name: 'Documentation',
      func: async () => {
        try {
          await openLinkInBrowser('https://docs.notesnook.com', colors);
        } catch (e) {}
      },
      desc: 'Learn about every feature and how it works.'
    },
    {
      name: 'Roadmap',
      func: async () => {
        try {
          await openLinkInBrowser(
            'https://docs.notesnook.com/roadmap/',
            colors
          );
        } catch (e) {}
      },
      desc: 'See what the future of Notesnook is going to be like.'
    },
    {
      name: 'About Notesnook',
      func: async () => {
        try {
          await openLinkInBrowser('https://notesnook.com', colors);
        } catch (e) {}
      },
      desc: format(APP_VERSION)
    }
  ];

  return (
    <>
      <ContainerTopSection>
        <TopHeader title="Settings" isBack={false} screen="Settings" />
      </ContainerTopSection>
      <View
        style={{
          height: '100%',
          backgroundColor: colors.bg
        }}>
        <ScrollView
          onScroll={e =>
            eSendEvent(eScrollEvent, {
              y: e.nativeEvent.contentOffset.y,
              screen: 'Settings'
            })
          }
          scrollEventThrottle={1}
          style={{
            paddingHorizontal: 0
          }}>
          <SettingsUserSection />

          <SettingsAppearanceSection />

          {Platform.OS === 'android' ? <SettingsGeneralOptions /> : null}

          <SettingsPrivacyAndSecurity />

          <SettingsBackupAndRestore />

          <SettingsDeveloperOptions />

          <SectionHeader
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            title="Other"
          />

          {!collapsed && (
            <>
              <View
                style={{
                  borderRadius: 5,
                  paddingVertical: 10,
                  width: '95%',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  marginTop: 10,
                  backgroundColor: colors.nav,
                  alignSelf: 'center'
                }}>
                <Paragraph
                  style={{
                    flexWrap: 'wrap',
                    flexBasis: 1,
                    textAlign: 'center'
                  }}
                  color={colors.pri}>
                  It took us a year to bring Notesnook to you. Help us make it
                  better by rating it on{' '}
                  {Platform.OS === 'ios' ? 'Appstore' : 'Playstore'}
                </Paragraph>
                <Seperator />
                <MButton
                  type="accent"
                  width="100%"
                  title={`Rate us on ${
                    Platform.OS === 'ios' ? 'Appstore' : 'Playstore'
                  }`}
                  onPress={async () => {
                    try {
                      await Linking.openURL(STORE_LINK);
                    } catch (e) {}
                  }}
                />
              </View>

              {otherItems.map(item => (
                <CustomButton
                  key={item.name}
                  title={item.name}
                  tagline={item.desc}
                  onPress={item.func}
                />
              ))}
            </>
          )}

          <AccoutLogoutSection />

          <View
            style={{
              height: 400
            }}
          />
        </ScrollView>
      </View>
    </>
  );
};

export default Settings;
