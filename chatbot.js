document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const chatBody = document.getElementById("chatBody");
  const userInput = document.getElementById("userInput");
  const sendButton = document.getElementById("sendButton");

  // Store conversation state
  let conversationState = {
    currentMood: null,
    isFirstInteraction: true,
    currentTopic: null,
    exerciseInProgress: false,
    lastQuoteType: null,
    waitingForStoryTheme: false, // Add this new property
  };

  // Start the conversation immediately when page loads
  startInitialConversation();

  // Data storage for quotes
  const quotes = {
    positive: [
      "Happiness is not something ready-made. It comes from your own actions. - Dalai Lama",
      "The only way to do great work is to love what you do. - Steve Jobs",
      "What you think, you become. What you feel, you attract. What you imagine, you create. - Buddha",
      "The most wasted of days is one without laughter. - E.E. Cummings",
      "Joy does not simply happen to us. We have to choose joy and keep choosing it every day. - Henri Nouwen",
    ],
    neutral: [
      "Life isn't about finding yourself. Life is about creating yourself. - George Bernard Shaw",
      "The purpose of our lives is to be happy. - Dalai Lama",
      "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
      "In the end, it's not the years in your life that count. It's the life in your years. - Abraham Lincoln",
      "Life is what happens when you're busy making other plans. - John Lennon",
    ],
    negative: [
      "This too shall pass. - Persian Sufi Poets",
      "You are allowed to be both a masterpiece and a work in progress simultaneously. - Sophia Bush",
      "When you can't find the sunshine, be the sunshine. - Unknown",
      "It's not whether you get knocked down, it's whether you get up. - Vince Lombardi",
      "The darkest hour has only sixty minutes. - Morris Mandel",
      "Even the darkest night will end and the sun will rise. - Victor Hugo",
      "Rock bottom became the solid foundation on which I rebuilt my life. - J.K. Rowling",
    ],
  };

  // Relaxation exercises
  const relaxationExercises = [
    {
      name: "Deep Breathing",
      steps: [
        "Find a comfortable position and close your eyes if you wish.",
        "Breathe in slowly through your nose for 4 counts.",
        "Hold your breath for 2 counts.",
        "Exhale slowly through your mouth for 6 counts.",
        "Follow the circle as it expands and contracts.",
      ],
    },
    {
      name: "Progressive Muscle Relaxation",
      steps: [
        "Start by sitting comfortably.",
        "Tense your shoulders by raising them toward your ears... hold for 5 seconds...",
        "Slowly release, feeling the tension flow away.",
        "Next, clench your fists tightly... hold for 5 seconds...",
        "Slowly release and notice the difference.",
        "Finally, press your feet firmly into the floor... hold for 5 seconds...",
        "Release and feel the relaxation spread through your body.",
      ],
    },
    {
      name: "5-4-3-2-1 Grounding",
      steps: [
        "Look around and name 5 things you can see.",
        "Notice 4 things you can physically feel right now.",
        "Listen for 3 different sounds around you.",
        "Identify 2 things you can smell (or like the smell of).",
        "Name 1 thing you can taste right now (or a favorite taste).",
      ],
    },
    {
      name: "Relaxing Story",
      steps: [
        "I'll create a calming story based on a theme you provide.",
        "As you read the story, try to visualize the scenes described.",
        "Let your imagination create a mental sanctuary.",
        "Notice how your body feels as you immerse yourself in the story.",
        "Take deep, slow breaths as you experience the narrative.",
      ],
    },
  ];

  // Mental health tips
  const mentalHealthTips = [
    "Practice self-compassion - treat yourself as kindly as you would treat a good friend.",
    "Take short breaks throughout the day to reset your mind.",
    "Limit social media use to reduce comparison and anxiety.",
    "Connect with supportive people - even a brief conversation can boost your mood.",
    "Get some sunlight each day - it can help regulate your mood and sleep cycle.",
    "Move your body in ways that feel good, whether that's walking, stretching, or dancing.",
    "Set small, achievable goals to build confidence and momentum.",
    "Create boundaries that protect your energy and mental space.",
    "Notice negative thought patterns and gently challenge them.",
    "Remember that your feelings are valid, even if they're uncomfortable.",
  ];

  //   // Toggle chat visibility
  //   chatIcon.addEventListener("click", function () {
  //     chatContainer.classList.toggle("hidden");
  //     chatIcon.classList.add("hidden");
  //     if (chatBody.children.length === 0) {
  //       // Initial greeting with typing indicator and delay
  //       startInitialConversation();
  //     }
  //   });

  //   closeChat.addEventListener("click", function () {
  //     chatContainer.classList.add("hidden");
  //     chatIcon.classList.remove("hidden");
  //   });

  // Send message when clicking send button
  sendButton.addEventListener("click", sendUserMessage);

  // Send message when pressing Enter
  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendUserMessage();
    }
  });

  function startInitialConversation() {
    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      sendBotMessage("Hi there! I'm MindChat, your mental health companion.");

      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          sendBotMessage("How are you feeling today?", [
            "Great! 😊",
            "Good 🙂",
            "Okay 😐",
            "Not so good 😕",
            "Stressed 😫",
            "Sad 😢",
          ]);
        }, 1000);
      }, 800);
    }, 1500);
  }

  function sendUserMessage() {
    const message = userInput.value.trim();
    if (message) {
      addMessage(message, "user-message");
      userInput.value = "";
      processUserMessage(message);
    }
  }

  function addMessage(text, className) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", className);
    messageDiv.textContent = text;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("typing-indicator");
    typingDiv.innerHTML = "<span></span><span></span><span></span>";
    typingDiv.id = "typingIndicator";
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    const typingIndicator = document.getElementById("typingIndicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  function sendBotMessage(text, options = null) {
    addMessage(text, "bot-message");

    if (options) {
      const optionsContainer = document.createElement("div");
      optionsContainer.classList.add("options-container");

      options.forEach((option) => {
        const button = document.createElement("button");
        button.classList.add("option-button");
        button.textContent = option;
        button.addEventListener("click", function () {
          addMessage(option, "user-message");
          processUserMessage(option);
        });
        optionsContainer.appendChild(button);
      });

      chatBody.appendChild(optionsContainer);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }

  // Get random quote based on mood
  function getRandomQuote(mood) {
    let quoteCategory;

    if (mood === "positive") {
      quoteCategory = quotes.positive;
    } else if (mood === "neutral") {
      quoteCategory = quotes.neutral;
    } else {
      quoteCategory = quotes.negative;
    }

    // Track last quote type to avoid repetition
    conversationState.lastQuoteType = mood;

    return quoteCategory[Math.floor(Math.random() * quoteCategory.length)];
  }

  // Get random mental health tip
  function getRandomTip() {
    return mentalHealthTips[
      Math.floor(Math.random() * mentalHealthTips.length)
    ];
  }

  // Core function to process user messages and determine response
  function processUserMessage(message) {
    // Convert message to lowercase for easier comparison
    const lowerMessage = message.toLowerCase();

    // Show typing indicator first
    showTypingIndicator();

    // Delay for typing simulation
    setTimeout(() => {
      removeTypingIndicator();

      // First interaction - mood assessment
      if (conversationState.isFirstInteraction) {
        handleInitialMoodAssessment(lowerMessage);
      } else if (conversationState.waitingForStoryTheme) {
        // Check for story theme input first, before checking if exercise is in progress
        handleStoryThemeInput(message);
      } else if (
        lowerMessage.includes("story") ||
        lowerMessage.includes("relaxing story")
      ) {
        startStoryExercise();
      }
      // Exercise in progress, don't interrupt
      else if (conversationState.exerciseInProgress) {
        sendBotMessage(
          "Let's finish the current exercise first. You're doing great!"
        );
      }
      // Handle exercise requests
      else if (lowerMessage.includes("deep breathing")) {
        startRelaxationExercise(0);
      } else if (lowerMessage.includes("muscle relaxation")) {
        startRelaxationExercise(1);
      } else if (lowerMessage.includes("grounding")) {
        startRelaxationExercise(2);
      }
      // Handle relaxation exercise selection
      else if (
        lowerMessage.includes("relaxation exercise") ||
        lowerMessage.includes("try different exercise")
      ) {
        offerRelaxationOptions();
      }
      // Handle quote requests
      else if (
        lowerMessage.includes("quote") ||
        lowerMessage.includes("another quote")
      ) {
        handleQuoteRequest();
      }

      // Handle relaxation requests
      else if (
        lowerMessage.includes("yes") &&
        (lowerMessage.includes("relaxation") ||
          lowerMessage.includes("exercise") ||
          lowerMessage.includes("like that"))
      ) {
        offerRelaxationOptions();
      }
      // Handle tip requests
      else if (
        lowerMessage.includes("tip") ||
        lowerMessage.includes("advice") ||
        lowerMessage.includes("mental health tip")
      ) {
        provideMentalHealthTip();
      }
      // Handle goodbye
      else if (
        lowerMessage.includes("bye") ||
        lowerMessage.includes("goodbye") ||
        lowerMessage.includes("that's all")
      ) {
        sendBotMessage(
          "Take care! Remember to be kind to yourself. Come back anytime you need support or just want to chat. Have a wonderful day! 😊"
        );
        // Terminate the session after a brief delay
        // setTimeout(() => {
        //   chatContainer.classList.add("hidden");
        //   chatIcon.classList.remove("hidden");
        // }, 2000);
      }
      // Handle rejection of suggestions
      else if (
        lowerMessage.includes("no") ||
        lowerMessage.includes("not now") ||
        lowerMessage.includes("later")
      ) {
        handleRejection();
      } else if (lowerMessage.includes("another story")) {
        startStoryExercise();
      }
      // Handle info request
      else if (
        lowerMessage.includes("tell me more") ||
        lowerMessage.includes("about")
      ) {
        provideBotInfo();
      }
      // Handle "better" response after exercise
      else if (lowerMessage.includes("better")) {
        handlePositiveFeedback();
      }
      // Handle neutral response after exercise
      else if (
        lowerMessage.includes("same") ||
        lowerMessage.includes("not sure")
      ) {
        handleNeutralFeedback();
      }
      // Handle thank you
      else if (lowerMessage.includes("thank")) {
        handleThanks();
      }
      // Handle general queries
      else {
        handleGeneralQuery();
      }
    }, 1000); // Delayed response for natural conversation flow
  }

  // Handler functions to make code more modular and maintainable

  function handleInitialMoodAssessment(message) {
    conversationState.isFirstInteraction = false;

    if (
      message.includes("great") ||
      message.includes("good") ||
      message.includes("😊") ||
      message.includes("🙂")
    ) {
      conversationState.currentMood = "positive";
      const quote = getRandomQuote("positive");

      sendBotMessage(
        "I'm glad to hear that! Here's a quote to brighten your day even more:"
      );

      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          sendBotMessage(`"${quote}"`);

          setTimeout(() => {
            showTypingIndicator();
            setTimeout(() => {
              removeTypingIndicator();
              sendBotMessage(
                "Is there something specific I can help you with today?",
                [
                  "Mental health tips",
                  "Just chatting",
                  "Relaxation exercise",
                  "Another quote",
                ]
              );
            }, 1000);
          }, 1500);
        }, 1200);
      }, 1000);
    } else if (
      message.includes("okay") ||
      message.includes("fine") ||
      message.includes("😐")
    ) {
      conversationState.currentMood = "neutral";
      const quote = getRandomQuote("neutral");

      sendBotMessage(
        "Sometimes 'okay' is perfectly fine. Here's a thoughtful quote for you:"
      );

      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          sendBotMessage(`"${quote}"`);

          setTimeout(() => {
            showTypingIndicator();
            setTimeout(() => {
              removeTypingIndicator();
              sendBotMessage(
                "Would you like a quick mental health tip or maybe try a relaxation exercise?",
                [
                  "Mental health tip",
                  "Relaxation exercise",
                  "Another quote",
                  "Just chat",
                ]
              );
            }, 1000);
          }, 1500);
        }, 1200);
      }, 1000);
    } else if (
      message.includes("not so good") ||
      message.includes("stressed") ||
      message.includes("sad") ||
      message.includes("anxious") ||
      message.includes("😕") ||
      message.includes("😫") ||
      message.includes("😢")
    ) {
      conversationState.currentMood = "negative";
      const quote = getRandomQuote("negative");

      sendBotMessage(
        "I'm sorry to hear you're not feeling your best. Remember that it's okay to not be okay sometimes."
      );

      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          sendBotMessage(
            `Here's a quote that might offer some comfort: "${quote}"`
          );

          setTimeout(() => {
            showTypingIndicator();
            setTimeout(() => {
              removeTypingIndicator();
              sendBotMessage(
                "Would you like to try a relaxation exercise? It might help you feel a bit better.",
                [
                  "Deep Breathing",
                  "Muscle Relaxation",
                  "Grounding Exercise",
                  "Not now",
                ]
              );
            }, 1200);
          }, 2000);
        }, 1500);
      }, 1800);
    } else {
      // Default if we can't determine mood
      conversationState.currentMood = "neutral";
      const quote = getRandomQuote("neutral");

      sendBotMessage(
        "I appreciate you sharing. Here's a thoughtful quote that might resonate with you:"
      );

      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          sendBotMessage(`"${quote}"`);

          setTimeout(() => {
            showTypingIndicator();
            setTimeout(() => {
              removeTypingIndicator();
              sendBotMessage("How can I support you today?", [
                "Mental health tips",
                "Relaxation exercise",
                "Another quote",
                "Just chat",
              ]);
            }, 1000);
          }, 1500);
        }, 1200);
      }, 1000);
    }
  }
  // Add these at the top of your file where other data structures are defined

  // Example stories for offline use or when API fails
  const fallbackStories = [
    {
      theme: "nature",
      content:
        "Imagine walking through a peaceful forest. Sunlight filters through the leaves, creating dappled patterns on the soft ground beneath your feet. The gentle sound of a stream echoes in the distance. Birds sing softly from the branches above. As you walk, you feel the tension leaving your body with each step. The air is fresh and clean, filling your lungs with renewed energy. You find a small clearing with a patch of soft grass and sit down, taking in the beauty and tranquility around you. For a few minutes, all your worries seem far away, replaced by the simple joy of being present in this peaceful moment.",
    },
    {
      theme: "ocean",
      content:
        "You're sitting on a warm, sandy beach. The ocean stretches before you, endless shades of blue meeting the sky at the horizon. Gentle waves roll in, creating a soothing rhythm as they reach the shore. The sound of water washing over sand creates a natural melody that helps your mind slow down. A soft breeze carries the salt air, refreshing and cleansing. You dig your toes into the warm sand, feeling grounded and connected to the earth. Time seems to slow down here, and you allow yourself to simply exist in this moment, breathing with the rhythm of the waves, letting go of any tension with each exhale.",
    },
    {
      theme: "mountains",
      content:
        "You stand at the top of a gentle hill, overlooking a vast mountain range. The peaks stretch into the distance, their slopes painted in shades of green and purple. The air here is crisp and cool, filling your lungs with vitality. A hawk circles lazily overhead, riding the warm air currents. The vast open space before you creates a sense of possibility and freedom. You take a deep breath, feeling small yet connected to the immense beauty around you. There's a profound quiet here, broken only by the occasional whisper of wind through the nearby pines. In this expansive setting, your thoughts seem to find more space, and your concerns feel lighter.",
    },
    {
      theme: "garden",
      content:
        "You're wandering through a beautiful garden in full bloom. Flowers of every color surround you—vibrant reds, soft purples, sunny yellows, and gentle pinks. Their sweet fragrance fills the air with a natural perfume that lifts your spirits. Butterflies flutter from blossom to blossom, and bees hum contentedly as they collect nectar. Stone pathways wind through the garden, leading to small benches and peaceful nooks. You find a comfortable spot beside a small fountain, whose gentle splashing creates a soothing soundtrack. The sunlight is warm on your skin, and a sense of peace settles over you. This is a place of renewal and growth, reminding you that beauty can be found even in the smallest details of life.",
    },
    {
      theme: "cozy",
      content:
        "You're sitting in a comfortable chair by a crackling fireplace. Outside the window, soft snow is falling, creating a world of quiet white. A warm blanket is wrapped around your shoulders, and the gentle weight of it feels like a reassuring hug. The scent of cinnamon and cloves drifts from a steaming mug of tea beside you. The room is filled with soft, golden light that creates a cocoon of warmth and safety. A book rests in your lap, but for now, you're content to simply watch the dancing flames and enjoy this moment of perfect comfort. The world outside, with all its demands and worries, seems very far away in this peaceful haven you've created.",
    },
    {
      theme: "rainy day",
      content:
        "You're sitting by a large window, watching raindrops trace lazy patterns down the glass. The gentle patter creates a soothing rhythm that slows your breathing naturally. The sky outside is a soft gray, making your cozy indoor space feel even more secure and warm. A soft blanket is draped across your lap, and the subtle weight of it is comforting. The fresh scent of rain fills the air, cleansing and renewing. There's something uniquely calming about being sheltered and dry while listening to the music of rainfall. You take a deep breath and feel the tension in your shoulders release. This quiet moment is a perfect pause from the busy world, a chance to simply be present with the peaceful sound of nature's gentle cleansing.",
    },
  ];

  // API key - in a real production app, you would store this more securely
  // For now, we'll define it here for simplicity
  const GROQ_API_KEY =
    "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"; // Replace with your actual API key

  // Add this to your relaxationExercises array
  const storyRelaxationExercise = {
    name: "Relaxing Story",
    steps: [
      "I'll create a calming story based on a theme you provide.",
      "As you read the story, try to visualize the scenes described.",
      "Let your imagination create a mental sanctuary.",
      "Notice how your body feels as you immerse yourself in the story.",
      "Take deep, slow breaths as you experience the narrative.",
    ],
  };

  // Function that attempts to generate a story using the Groq API via fetch
  async function generateStoryWithAPI(theme) {
    // If API key isn't set, fall back to pre-written stories
    if (
      !GROQ_API_KEY ||
      GROQ_API_KEY ===
        "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"
    ) {
      console.log("No API key set, using fallback story");
      return getFallbackStory(theme);
    }

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content:
                  "You are a therapeutic storyteller focused on creating calming, positive narratives for mental wellbeing.",
              },
              {
                role: "user",
                content: `Create a short, relaxing story (150-200 words) centered around a theme of "${theme}". 
              The story should be calming, positive, and support good mental health. 
              Focus on sensory details and mindfulness. 
              Use second-person perspective ("you") to help the reader imagine themselves in the scene. 
              Avoid any references to anxiety, depression, or negative emotions.`,
              },
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        }
      );

      if (!response.ok) {
        console.error("API error:", response.status);
        return getFallbackStory(theme);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || getFallbackStory(theme);
    } catch (error) {
      console.error("Error generating story with API:", error);
      return getFallbackStory(theme);
    }
  }

  // Function to get a fallback story if API fails
  function getFallbackStory(theme) {
    // Try to match the theme
    const lowerTheme = theme.toLowerCase();
    let matchedTheme = fallbackStories.find(
      (story) =>
        lowerTheme.includes(story.theme) || story.theme.includes(lowerTheme)
    );

    // If no match, return a random story
    if (!matchedTheme) {
      const randomIndex = Math.floor(Math.random() * fallbackStories.length);
      return fallbackStories[randomIndex].content;
    }

    return matchedTheme.content;
  }

  // Add this function to start the story generation exercise
  function startStoryExercise() {
    conversationState.exerciseInProgress = true;

    sendBotMessage(
      "I'd love to tell you a relaxing story. What theme or setting would you like the story to be about? For example: nature, ocean, mountains, a cozy cabin, or anything else that feels calming to you."
    );

    // Set a special state to indicate we're waiting for a story theme
    conversationState.waitingForStoryTheme = true;
  }

  // Add this handler for when user provides a story theme
  async function handleStoryThemeInput(theme) {
    sendBotMessage(
      `I'll create a relaxing story about ${theme}. Give me just a moment...`
    );
    showTypingIndicator();

    try {
      // Get the story - either from API or fallback
      let story;

      // Try with API first if key is set
      if (GROQ_API_KEY && GROQ_API_KEY !== "YOUR_API_KEY_HERE") {
        try {
          story = await generateStoryWithAPI(theme);
        } catch (error) {
          console.error("API story generation failed:", error);
          story = getFallbackStory(theme);
        }
      } else {
        // If no API key, use fallback directly
        story = getFallbackStory(theme);
      }

      setTimeout(() => {
        removeTypingIndicator();
        sendBotMessage(
          "Here's your story. Take a moment to read it slowly and visualize the scene:"
        );

        setTimeout(() => {
          sendBotMessage(story);

          // After the story is completed
          setTimeout(() => {
            conversationState.exerciseInProgress = false;
            conversationState.waitingForStoryTheme = false;

            sendBotMessage("How did the story make you feel?", [
              "Relaxed",
              "Peaceful",
              "The same",
              "I'd like another story",
            ]);
          }, 3000);
        }, 1500);
      }, 2000);
    } catch (error) {
      console.error("Error in story generation:", error);
      removeTypingIndicator();
      sendBotMessage(
        "I'm having some trouble creating a story right now. Would you like to try a different relaxation exercise instead?",
        ["Deep Breathing", "Muscle Relaxation", "Grounding Exercise"]
      );
      conversationState.exerciseInProgress = false;
      conversationState.waitingForStoryTheme = false;
    }
  }

  function handleQuoteRequest() {
    // Vary the response based on previous mood
    const moodTypes = ["positive", "neutral", "negative"];
    let quoteType;

    // Don't repeat the same quote type
    do {
      quoteType = moodTypes[Math.floor(Math.random() * moodTypes.length)];
    } while (quoteType === conversationState.lastQuoteType);

    const quote = getRandomQuote(quoteType);

    sendBotMessage("Here's another quote for you:");

    setTimeout(() => {
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        sendBotMessage(`"${quote}"`);

        setTimeout(() => {
          showTypingIndicator();
          setTimeout(() => {
            removeTypingIndicator();
            sendBotMessage("Would you like to explore something else?", [
              "Another quote",
              "Relaxation exercise",
              "Mental health tip",
              "That's all for now",
            ]);
          }, 800);
        }, 1500);
      }, 1200);
    }, 1000);
  }

  function offerRelaxationOptions() {
    sendBotMessage(
      "I have several relaxation techniques that might help. Which one would you like to try?",
      [
        "Deep Breathing",
        "Muscle Relaxation",
        "Grounding Exercise",
        "Relaxing Story",
      ]
    );
  }

  function provideMentalHealthTip() {
    const tip = getRandomTip();

    sendBotMessage("Here's a mental health tip that might be helpful:");

    setTimeout(() => {
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        sendBotMessage(tip);

        setTimeout(() => {
          showTypingIndicator();
          setTimeout(() => {
            removeTypingIndicator();
            sendBotMessage(
              "Would you like to try a relaxation exercise to complement this tip?",
              ["Yes, that sounds good", "Another tip instead", "No thanks"]
            );
          }, 1000);
        }, 2000);
      }, 1200);
    }, 1000);
  }

  function handleRejection() {
    const responses = [
      "That's completely fine. I'm here whenever you need me.",
      "No problem at all. We can chat about something else if you'd like.",
      "I understand. Is there something else you'd prefer to talk about?",
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    sendBotMessage(response, [
      "Mental health tips",
      "Just chat",
      "I'm good for now",
    ]);
  }

  function provideBotInfo() {
    sendBotMessage(
      "I'm a mental health chatbot designed to provide support through relaxation exercises, positive quotes, and helpful mental wellness tips. I'm here to listen and offer techniques that might help you feel better.",
      [
        "Show me a relaxation exercise",
        "Give me a mental health tip",
        "Share a quote",
      ]
    );
  }

  function handlePositiveFeedback() {
    const responses = [
      "I'm so glad to hear that! Small moments of self-care can make a big difference.",
      "That's wonderful! Remember this feeling and the technique that helped you get here.",
      "Great! It's amazing how these simple exercises can shift our state of mind.",
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    sendBotMessage(response);

    setTimeout(() => {
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        sendBotMessage("Is there something else you'd like to explore today?", [
          "Relaxation exercise",
          "Mental health tip",
          "Positive quote",
          "That's all for now",
        ]);
      }, 1000);
    }, 1500);
  }

  function handleNeutralFeedback() {
    sendBotMessage(
      "That's okay. These techniques affect everyone differently, and sometimes it takes practice or finding the right approach for you."
    );

    setTimeout(() => {
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        sendBotMessage(
          "Would you like to try a different type of exercise, or perhaps a mental health tip instead?",
          ["Try different exercise", "Mental health tip", "Positive quote"]
        );
      }, 1200);
    }, 1800);
  }

  function handleThanks() {
    const responses = [
      "You're very welcome! I'm glad I could help.",
      "It's my pleasure. Taking care of your mental health is important.",
      "Anytime! Remember that self-care is an ongoing journey.",
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    sendBotMessage(response, [
      "Relaxation exercise",
      "Mental health tip",
      "Positive quote",
      "Goodbye",
    ]);
  }

  function handleGeneralQuery() {
    sendBotMessage(
      "I'm here to support your mental wellbeing. What would you like to explore today?",
      [
        "Relaxation exercise",
        "Mental health tip",
        "Positive quote",
        "Just chat",
      ]
    );
  }

  // Function to handle relaxation exercises with step-by-step instructions
  function startRelaxationExercise(exerciseIndex) {
    // Set exercise in progress to prevent interruptions
    conversationState.exerciseInProgress = true;

    const exercise = relaxationExercises[exerciseIndex];
    sendBotMessage(
      `Let's try the ${exercise.name} exercise. I'll guide you through it step by step.`
    );

    let stepIndex = 0;

    // Function to show each step with a delay
    function showNextStep() {
      if (stepIndex < exercise.steps.length) {
        setTimeout(() => {
          showTypingIndicator();
          setTimeout(() => {
            removeTypingIndicator();
            sendBotMessage(exercise.steps[stepIndex]);

            // For breathing exercise, show animation on appropriate step
            if (
              exerciseIndex === 0 &&
              stepIndex === exercise.steps.length - 1
            ) {
              // Create a container for the breathing animation
              const breathingContainer = document.createElement("div");
              breathingContainer.classList.add("breathing-container");
              chatBody.appendChild(breathingContainer);

              // Create the animation element (the circle)
              // The text will now be handled by CSS ::after pseudo-element
              const breathingDiv = document.createElement("div");
              breathingDiv.classList.add("breathing-animation");
              breathingContainer.appendChild(breathingDiv);

              chatBody.scrollTop = chatBody.scrollHeight;

              // After a few cycles, end the exercise
              setTimeout(() => {
                finishExercise();
              }, 15000);
            } else {
              stepIndex++;
              showNextStep();
            }
          }, 1000);
        }, 2000);
      } else if (exerciseIndex !== 0) {
        // Skip for breathing exercise as it has special handling
        finishExercise();
      }
    }

    // Function to finish the exercise
    function finishExercise() {
      // Reset exercise state
      conversationState.exerciseInProgress = false;

      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          sendBotMessage("Great job! How do you feel now?", [
            "Better",
            "The same",
            "Not sure",
          ]);
        }, 1000);
      }, 1500);
    }

    // Start showing steps
    showNextStep();
  }

  // PLACEHOLDER FOR ADDITIONAL FEATURES
  // ------------------------------
  // 1. User mood tracking over time
  // 2. Customizable relaxation timers
  // 3. Journal entry functionality
  // 4. Mindfulness exercise library
  // 5. Emergency resources section
  // 6. Daily check-in reminders
  // 7. Motivational messages based on usage patterns
  // 8. Personalized user experience based on preferences
  // ------------------------------
});
