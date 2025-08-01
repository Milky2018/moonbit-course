/* @ts-check */
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

// <code>

// pull in the required packages.
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import fs from "node:fs/promises";
import "core-js/actual/promise/index.js";

// replace with your own subscription key,
// service region (e.g., "westus"), and
// the name of the file you save the synthesized audio.
const subscriptionKey = process.env.TTS_KEY || "YourSubscriptionKey";
const serviceRegion = process.env.TTS_REGION || "YourServiceRegion";
const filename = "YourAudioFile.wav";

// we are done with the setup

// now create the audio-config pointing to our stream and
// the speech config specifying the language.
const audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

// create the speech synthesizer.
const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);



const text = await fs.readFile("course1/script.xml", "utf8");

const { promise, resolve, reject } = Promise.withResolvers();
synthesizer.speakSsmlAsync(text, resolve, reject);

try {
    const result = await promise;
    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("synthesis finished.");
    } else {
        console.error("Speech synthesis canceled, " + result.errorDetails +
            "\nDid you update the subscription info?");
    }
    synthesizer.close();
} catch (err) {
    console.trace("err - " + err);
    synthesizer.close();
}

// </code>