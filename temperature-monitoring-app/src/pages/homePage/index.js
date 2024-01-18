import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {

    const [isConnected, setIsConnected] = useState(false);
    const [batteryLevel, setBatteryLevel] = useState(null);
    const [isCharging, setIsCharging] = useState(false);

    useEffect(() => {
        checkConnectionStatus();
    }, []);

    useEffect(() => {
        // Check if the Battery Status API is supported
        if ('getBattery' in navigator) {
          navigator.getBattery().then(function(battery) {
            // Initial battery level
            updateBatteryInfo(battery);
    
            // Listen for changes in battery level
            battery.addEventListener('levelchange', function() {
              updateBatteryInfo(battery);
            });
          });
        } else {
          console.log('Battery Status API not supported in this browser.');
        }
    
        // Clean up event listeners when the component unmounts
        return () => {
          if ('getBattery' in navigator) {
            navigator.getBattery().then(function(battery) {
              battery.removeEventListener('levelchange', function() {
                updateBatteryInfo(battery);
              });
            });
          }
        };
      }, []); 


    function checkConnectionStatus() {
        
    }

    const updateBatteryInfo = (battery) => {
        setBatteryLevel(battery.level * 100);
        setIsCharging(battery.charging);
    };
    return (
        <div>
            <h1>Dashboard</h1>
            <p>
                {isConnected ? 'yes' : 'no'}
            </p>
            <p>{batteryLevel}</p>
            <p>{isCharging ? 'yes' : 'no'}</p>
        </div>
    );
}