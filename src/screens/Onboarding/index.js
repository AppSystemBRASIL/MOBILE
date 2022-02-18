import React, { useEffect, useRef, useState, useContext, StatusBar } from 'react';
import { View, TouchableOpacity, Text, FlatList, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AntDesignIcons from 'react-native-vector-icons/AntDesign';

import { COLORS, SIZES } from '../../utils/constants';

import data from '../../data/onboarding';

import Context from '../../context';

import { themeDefault } from '../../config';

const OnboardingScreen = ({ setViewedOnboarding }) => {
  const flatlistRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [viewableItems, setViewableItems] = useState([]);

  const { corretora } = useContext(Context);

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    setViewableItems(viewableItems)
  });

  useEffect(() => {
    if(!viewableItems[0] || currentPage === viewableItems[0].index) {
      return
    }
    
    setCurrentPage(viewableItems[0].index);
  }, [viewableItems]);

  const handleSkipToEnd = () => {
    flatlistRef.current.scrollToIndex({
      animated: true,
      index: data.length - 1
    })
  }

  const handleNext = () => {
    if(currentPage === data.length-1) {
      return;
    }

    flatlistRef.current.scrollToIndex({
      animated: true,
      index: currentPage + 1
    });
  }

  const handleBack = () => {
    if(currentPage === 0) {
      return;
    }

    flatlistRef.current.scrollToIndex({
      animated: true,
      index: currentPage - 1
    });
  }

  const TopSection = () => {
    return (
      <SafeAreaView>
        <View 
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: SIZES.base * 2
          }}
        >
          {currentPage !== 0 ? (
            <TouchableOpacity
              onPress={handleBack}
              style={{
                padding: SIZES.base,
              }}
            >
              <AntDesignIcons name='left' 
                style={{
                  fontSize: 25,
                  color: COLORS(corretora ? corretora.layout.theme : themeDefault).black,
                  opacity: 1
                }} 
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                padding: SIZES.base,
              }}
            >
              <AntDesignIcons name='left' 
                style={{
                  fontSize: 25,
                  color: COLORS(corretora ? corretora.layout.theme : themeDefault).black,
                  opacity: 0
                }} 
              />
            </TouchableOpacity>
          )}
          {currentPage !== data.length-1 && (
            <TouchableOpacity
              onPress={handleSkipToEnd}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: COLORS(corretora ? corretora.layout.theme : themeDefault).black,
                  opacity: 1
                }}
              >
                PULAR
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const BottomSection = () => {
    return (
      <SafeAreaView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: SIZES.base * 2,
            paddingVertical: SIZES.base * 2
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            {
              [...Array(data.length)].map((item, index) => (
                <View
                  key={index}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: index === currentPage ? COLORS(corretora ? corretora.layout.theme : themeDefault).primary : COLORS(corretora ? corretora.layout.theme : themeDefault).primary + '20',
                    marginRight: 8
                  }}
                />
              ))
            }
          </View>
          {currentPage !== data.length - 1 ? (
            <TouchableOpacity
              onPress={handleNext}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary
              }}
              activeOpacity={0.8}
            >
              <AntDesignIcons 
                name='right'
                style={{
                  fontSize: 18,
                  color: 'white',
                  opacity: 0.3
                }}
              />
              <AntDesignIcons 
                name='right'
                style={{
                  fontSize: 25,
                  color: 'white',
                  marginLeft: -15
                }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setViewedOnboarding(true)}
              style={{
                paddingHorizontal: SIZES.base * 2,
                height: 60,
                borderRadius: 30,
                backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  marginLeft: SIZES.base
                }}
              >
                TEXTO
              </Text>
              <AntDesignIcons 
                name='right'
                style={{
                  fontSize: 18,
                  color: 'white',
                  opacity: 0.3,
                  marginLeft: SIZES.base
                }}
              />
              <AntDesignIcons 
                name='right'
                style={{
                  fontSize: 25,
                  color: 'white',
                  marginLeft: -15
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const renderFlatListItem = ({ item }) => {
    return (
      <View
        style={{
          width: SIZES.width,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <View style={{
          alignItems: 'center',
          marginVertical: SIZES.base * 2
        }}>
          <ImageBackground
            source={item.img}
            style={{
              width: 355,
              height: 355,
              resizeMode: 'contains'
            }}
          />
        </View>
        <View
          style={{
            paddingHorizontal: SIZES.base * 4,
            marginVertical: SIZES.base * 4
          }}
        >
          <Text
            style={{
              fontSize: 30,
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 18,
              opacity: 0.4,
              textAlign: 'center',
              marginTop: 15,
              lineHeight: 28
            }}
          >
            {item.description}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).background,
        justifyContent: 'center'
      }}
    >
      <StatusBar hidden />
      <TopSection />
      <FlatList 
        data={data}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={renderFlatListItem}
        ref={flatlistRef}
        onViewableItemsChanged={handleViewableItemsChanged.current}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 100}}
        initialNumToRender={1}
        extraData={SIZES.width}
      />
      <BottomSection />
    </View>
  )
}

export default OnboardingScreen;