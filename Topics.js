import React, { useRef, useState } from 'react'
import { Dimensions, Text } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
    useAnimatedGestureHandler,
    useSharedValue,
    withDecay,
    withSpring,
    cancelAnimation,
    useAnimatedStyle
} from 'react-native-reanimated'

const topics = [
    {
        emoji: '🍻',
        text: 'Entertainment'
    },
    {
        emoji: '🐈',
        text: 'Cats'
    },
    {
        emoji: '🦾',
        text: 'Robots'
    },
    {
        emoji: '🎉',
        text: 'Party'
    },
    {
        emoji: '🌍',
        text: 'World'
    },
    {
        emoji: '📚',
        text: 'Books'
    },
    {
        emoji: '👘',
        text: 'Fashion'
    },
    {
        emoji: '📱',
        text: 'Applications'
    },
    {
        emoji: '📸',
        text: 'Photography'
    },
    {
        emoji: '🧠',
        text: 'Ideas'
    },
    {
        emoji: '⚔️',
        text: 'War'
    },
    {
        emoji: '💼',
        text: 'Business'
    },
    {
        emoji: '🎭',
        text: 'Theater'
    },
    {
        emoji: '📮',
        text: 'Job'
    }
]
const { width: screenWidth } = Dimensions.get('screen')
const topicContainerMargin = 5
const containerPaddingHorizontal = 10

const Topics = () => {
    const topicPositionRef = useRef({})
    const [topicPosition, setTopicPosition] = useState({})
    const translateX = useSharedValue(0)
    const { container, topicContainer, topicText, title } = styles
    const onGestureEvent = useAnimatedGestureHandler({
        onStart: (event, context) => {
            if (context.isDecayAnimationRunning) {
                context.isDecayAnimationRunning = false
                cancelAnimation(translateX)
            }
        },
        onActive: (event, context) => {
            translateX.value = (context.offset || 0) + event.translationX
        },
        onEnd: (event, context) => {
            context.offset = translateX.value
            const { offset } = context
            const { velocityX } = event
            const maxLevelDifference = screenWidth - Math.max(...Object.values(topicPosition.levelWidth))
            const leftBound = 0
            const rightBound = maxLevelDifference - containerPaddingHorizontal - topicContainerMargin

            if (offset > leftBound) {
                context.offset = leftBound
                translateX.value = withSpring(leftBound, {
                    velocity: velocityX,
                    mass: 0.6,
                    stiffness: 90
                })
            } else if (offset < rightBound) {
                context.offset = rightBound
                translateX.value = withSpring(rightBound, {
                    velocity: velocityX,
                    mass: 0.6,
                    stiffness: 90
                })
            } else {
                context.isDecayAnimationRunning = true
                translateX.value = withDecay(
                    {
                        velocity: velocityX,
                        clamp: velocityX < 0 ? [rightBound, translateX.value] : [translateX.value, 0]
                    },
                    () => {
                        context.isDecayAnimationRunning = false
                        context.offset = translateX.value
                    }
                )
            }
        }
    }, [topicPosition])

    const handleItemLayout = (event, topic) => {
        if (!topicPositionRef.current[topic]) {
            topicPositionRef.current[topic] = event.nativeEvent

            if (Object.keys(topicPositionRef.current).length === topics.length) {
                const topicPosition = Object.values(topicPositionRef.current).reduce((accumulator, current) => {
                    if (!accumulator.levelWidth) {
                        accumulator.levelWidth = {}
                    }

                    if (!accumulator.levelWidth[current.layout.y]) {
                        accumulator.levelWidth[current.layout.y] = 0
                    }

                    const tempMax = accumulator.levelWidth[current.layout.y]
                    const maybeMax = current.layout.x + current.layout.width

                    if (maybeMax > tempMax) {
                        accumulator.levelWidth[current.layout.y] = maybeMax + topicContainerMargin
                    }

                    return accumulator
                }, topicPositionRef.current)
                setTopicPosition(topicPosition)
            }
        }
    }

    const Topic = ({ topic }) => {
        const { emoji, text } = topic
        const style = useAnimatedStyle(() => {
            const { levelWidth } = topicPosition

            if (levelWidth) {
                const levelDifference = screenWidth - levelWidth[topicPosition[text].layout.y]
                const maxLevelDifference = screenWidth - Math.max(...Object.values(levelWidth))
                const translationX = levelDifference > 0
                    ? translateX.value
                    : (levelDifference * translateX.value) / maxLevelDifference

                return {
                    transform: [
                        {
                            translateX: translationX
                        }
                    ]
                }
            }
            return {}
        }, [topicPosition])

        return (
            <Animated.View
                style={[topicContainer, style]}
                onLayout={event => handleItemLayout(event, text)}>
                <Text>
                    {emoji}
                </Text>
                <Text style={topicText}>
                    {text}
                </Text>
            </Animated.View>
        )
    }

    return (
        <PanGestureHandler {...{ onGestureEvent }}>
            <Animated.View>
                <Text style={title}>
                    {'TOPICS TO EXPLORE'}
                </Text>
                <Animated.View
                    horizontal
                    style={container}>
                    {topics.map(topic => <Topic key={topic.text} {...{ topic }}/>)}
                </Animated.View>
            </Animated.View>
        </PanGestureHandler>
    )
}

const styles = {
    container: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        width: screenWidth * 1.8,
        paddingHorizontal: containerPaddingHorizontal
    },
    topicContainer: {
        borderWidth: 1,
        borderColor: '#ecd9d9',
        borderBottomWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        margin: topicContainerMargin,
        backgroundColor: '#FFF'
    },
    topicText: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 5
    },
    title: {
        fontSize: 13,
        color: 'rgb(134,130,119)',
        marginBottom: 5,
        marginLeft: 15,
        fontWeight: '600'
    }
}

Topics.displayName = 'Topics'

export default Topics