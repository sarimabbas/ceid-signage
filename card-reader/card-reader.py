#!/usr/bin/env python3


import time
import requests
from lib import pcprox
from time import sleep


def setupCardReader():
    print("Setting up card reader...")
    cardReader = pcprox.open_pcprox(debug=False)
    # Show the device info
    print(repr(cardReader.get_device_info()))
    # Dump the configuration from the device.
    config = cardReader.get_config()
    config.print_config()
    # Disable sending keystrokes, as we want direct control
    config.bHaltKBSnd = True
    # Turn on the red LED, turn ff the green LED
    setCardReaderLEDRed(cardReader)
    # Tells pcProx that the LEDs are under application control
    config.bAppCtrlsLED = True
    # Send the updated configuration to the device
    config.set_config(cardReader)
    # Exit configuration mode
    cardReader.end_config()
    print("Finished setting up card reader!")
    # return the dev
    return cardReader


def setCardReaderLEDGreen(cardReader):
    config = cardReader.get_config()
    config.iRedLEDState = False
    config.iGrnLEDState = True
    config.set_config(cardReader)


def setCardReaderLEDRed(cardReader):
    config = cardReader.get_config()
    config.iRedLEDState = True
    config.iGrnLEDState = False
    config.set_config(cardReader)


def main():
    cardReader = setupCardReader()

    debounceDelayInSeconds = 2.0
    lastDebounceTime = 0
    readyIndicator = True

    while True:
        # read the card
        tagRead = cardReader.get_tag()

        # on next iteration of the loop, check for debounce time
        if time.time() - lastDebounceTime > debounceDelayInSeconds:

            if readyIndicator:
                setCardReaderLEDRed(cardReader)
                print("Ready to accept swipe")
                readyIndicator = False

            if tagRead is not None:
                tagAsString = pcprox._format_hex(tagRead[0])
                # print(tagAsString)
                setCardReaderLEDGreen(cardReader)

                try:
                    response = requests.get(
                        "https://us-central1-ceid-swiper.cloudfunctions.net/swipeCard",
                        params={"tagId": tagAsString},
                    )
                    print(response.text)
                except:
                    print("error sending request")

                lastDebounceTime = time.time()
                readyIndicator = True

        # yield to the OS
        time.sleep(0.01)


if __name__ == "__main__":
    main()
