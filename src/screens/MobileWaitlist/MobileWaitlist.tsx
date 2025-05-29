import React, { useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

// Define city data with their time zones
type City = {
  name: string;
  timezone: string;
};

const CITIES: City[] = [
  { name: 'PARIS', timezone: 'Europe/Paris' },
  { name: 'NEW YORK', timezone: 'America/New_York' },
  { name: 'TOKYO', timezone: 'Asia/Tokyo' },
  { name: 'LONDON', timezone: 'Europe/London' },
  { name: 'DUBAI', timezone: 'Asia/Dubai' },
];

interface MobileWaitlistProps {
  currentTime: string;
}

export const MobileWaitlist = ({ currentTime }: MobileWaitlistProps): JSX.Element => {
  const [invitationCode, setInvitationCode] = useState<string[]>(Array(6).fill(''));
  const [email, setEmail] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showInviteSuccessDialog, setShowInviteSuccessDialog] = useState(false);
  const [showInviteErrorDialog, setShowInviteErrorDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...invitationCode];
    newCode[index] = value.toUpperCase();
    setInvitationCode(newCode);
  };

  const handleSubmit = () => {
    const code = invitationCode.join('');
    console.log('Submitted invitation code:', code);

    if (code.length !== 6 || invitationCode.some(char => char === '')) {
      setInvitationCode(Array(6).fill(''));
      setShowInviteErrorDialog(true);
      
      setTimeout(() => {
        setShowInviteErrorDialog(false);
      }, 10000);
      return;
    }

    setInvitationCode(Array(6).fill(''));
    setShowInviteSuccessDialog(true);
    
    setTimeout(() => {
      setShowInviteSuccessDialog(false);
    }, 10000);
  };

  const handleEmailSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setEmailError('');

    try {
      const response = await fetch('https://expressjs-prisma-production-bd0a.up.railway.app/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setShowSuccessDialog(true);
      setEmail('');
      
      setTimeout(() => {
        setShowSuccessDialog(false);
      }, 10000);
    } catch (error) {
      console.error('Error:', error);
      setEmailError('Failed to submit email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-[375px] h-[667px] relative">
        {/* Top status bar with animation */}
        <div className="absolute w-screen h-[30px] border-b border-llcrouge top-0 left-0 overflow-hidden cursor-default">
          <div className="animate-slide flex cursor-default">
            <img
              className="h-[30px] w-screen object-cover cursor-default"
              alt="Sub header waitlist"
              src="/sub-header-waitlist-1.svg"
            />
            <img
              className="h-[30px] w-screen object-cover cursor-default"
              alt="Sub header waitlist"
              src="/sub-header-waitlist-1.svg"
            />
          </div>
        </div>

        {/* Logo */}
        <img
          className="absolute w-[333px] h-[57px] top-12 left-[21px]"
          alt="Logo long"
          src="/logo-long.png"
        />

        {/* Main content section */}
        <div className="absolute w-[379px] h-60 top-[120px] left-0 border-t border-b border-llcrouge">
          <img
            className="top-0 absolute w-[375px] h-px left-0 object-cover"
            alt="Line"
            src="/line-10.svg"
          />

          {/* Soon in the club badge with animation */}
          <Badge className="absolute w-[110px] h-[35px] top-6 left-2.5 bg-white rounded-[55px/17.5px] border border-solid border-[#fe240b] rotate-[-5deg] flex items-center justify-center badge-animate">
            <div className="[font-family:'DM_Mono',Helvetica] font-medium text-[#fe240b] text-xs text-center tracking-[0.24px] leading-3">
              SOON IN
              <br />
              THE CLUB!
            </div>
          </Badge>

          {/* City selector and time display */}
          <div className="absolute w-32 h-[45px] top-5 right-5 flex flex-col items-start [font-family:'DM_Mono',Helvetica] font-normal text-[#fe240b] text-xs">
            <Select
              value={selectedCity.name}
              onValueChange={(value) => {
                const city = CITIES.find(c => c.name === value);
                if (city) setSelectedCity(city);
              }}
            >
              <SelectTrigger className="w-full border-0 p-0 h-auto shadow-none text-left text-[#fe240b] [font-family:'DM_Mono',Helvetica] font-normal text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#fe240b]">
                {CITIES.map((city) => (
                  <SelectItem
                    key={city.name}
                    value={city.name}
                    className="text-[#fe240b] [font-family:'DM_Mono',Helvetica] cursor-pointer hover:bg-[#fe240b] hover:bg-opacity-10"
                  >
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-0.5 text-left">
              {currentTime}
            </div>
          </div>

          {/* Main headline */}
          <div className="absolute w-[333px] h-[120px] top-20 left-[21px] [font-family:'DM_Sans',Helvetica] font-normal text-llcrouge text-[25px] tracking-[0] leading-[25px]">
            THE ULTIMATE CURATION OF DURABLE AND TECH-ORIENTED CONSUMER PRODUCTS
            FOR THE MOST DEMANDING INDIVIDUALS.
          </div>

          <img
            className="top-60 absolute w-[375px] h-px left-0 object-cover"
            alt="Line"
            src="/line-10.svg"
          />
        </div>

        {/* Invitation code and waitlist section */}
        <div className="absolute w-[375px] h-[220px] top-[390px] left-0">
          <div className="absolute w-[375px] h-[220px] top-0 left-0">
            <div className="flex flex-col w-[281px] items-start gap-[15px] absolute top-0 left-[21px]">
              <div className="relative self-stretch h-2.5 mt-[-1.00px] [font-family:'DM_Mono',Helvetica] font-normal text-[#fe240b] text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                INVITATION CODE
              </div>

              {/* OTP Input for invitation code */}
              <div className="relative w-[281px] h-[45px] flex items-center">
                <div className="flex gap-1">
                  {invitationCode.slice(0, 3).map((char, index) => (
                    <div
                      key={`code-1-${index}`}
                      className="flex w-8 h-[45px] items-center justify-center gap-2.5 px-3.5 py-1 relative rounded-[5px] border border-solid border-[#fe240b]"
                    >
                      <input
                        type="text"
                        value={char}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        className="w-6 z-10 h-8 bg-transparent text-center text-[#fe240b] [font-family:'DM_Mono',Helvetica] font-normal text-2xl outline-none"
                        maxLength={1}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-1 ml-1">
                  {invitationCode.slice(3).map((char, index) => (
                    <div
                      key={`code-2-${index}`}
                      className="flex w-8 h-[45px] items-center justify-center gap-2.5 px-3.5 py-1 relative rounded-[5px] border border-solid border-[#fe240b]"
                    >
                      <input
                        type="text"
                        value={char}
                        onChange={(e) => handleCodeChange(index + 3, e.target.value)}
                        className="w-6 z-10 h-8 bg-transparent text-center text-[#fe240b] [font-family:'DM_Mono',Helvetica] font-normal text-2xl outline-none"
                        maxLength={1}
                      />
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={handleSubmit}
                  className="w-[42px] h-[30px] ml-2 bg-llcrouge rounded-[5px] flex items-center justify-center"
                >
                  <div className="[font-family:'DM_Mono',Helvetica] font-normal text-white text-sm tracking-[0.56px] leading-[normal] whitespace-nowrap">
                    OK
                  </div>
                </Button>
              </div>
            </div>

            {/* OR divider */}
            <div className="absolute w-[375px] h-10 top-[100px] left-0">
              <div className="relative h-10">
                <Separator className="top-5 absolute w-[375px] h-px left-0 bg-llcrouge" />

                <div className="absolute w-[42px] h-10 top-0 left-[21px]">
                  <div className="relative w-10 h-10 bg-white rounded-[20px] border border-solid border-[#fe240b] flex items-center justify-center">
                    <div className="rotate-[-5deg] [font-family:'DM_Mono',Helvetica] font-medium text-llcrouge text-xs text-center tracking-[0.24px] leading-[14px] whitespace-nowrap">
                      OR
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Club members badge with animation */}
            <Badge className="absolute w-[110px] h-[35px] top-[106px] left-[238px] bg-white rounded-[55px/17.5px] border border-solid border-[#fe240b] rotate-[-5deg] flex items-center justify-center badge-animate">
              <div className="[font-family:'DM_Mono',Helvetica] font-medium text-[#fe240b] text-xs text-center tracking-[0.24px] leading-3">
                +1200 CLUB
                <br />
                MEMBERS
              </div>
            </Badge>

            {/* Email waitlist section */}
            <div className="absolute w-[302px] h-[50px] top-[170px] left-5">
              <div className="absolute w-[222px] h-[50px] top-0 left-0">
                <div className="relative w-[143px] h-2.5 top-0 left-0 [font-family:'DM_Mono',Helvetica] font-normal text-llcrouge text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                  JOIN THE WAITLIST
                </div>

                <div className="flex flex-col w-[220px] items-start justify-end px-0 absolute top-[35px] left-0 border-b [border-bottom-style:solid] border-[#fe240b]">
                  <Input
                    className="border-0 h-6 placeholder:text-llcrouge px-0 py-0 [font-family:'DM_Mono',Helvetica] font-normal text-llcrouge text-sm tracking-[0.56px] focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                    placeholder="EMAIL"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                  />
                  {emailError && (
                    <div className="mt-2 text-sm text-llcrouge [font-family:'DM_Mono',Helvetica]">
                      {emailError}
                    </div>
                  )}
                </div>
              </div>

              <Button 
                className="w-[62px] top-[35px] left-60 flex items-center justify-center gap-2.5 p-2.5 absolute bg-llcrouge rounded-[5px] disabled:opacity-50"
                onClick={handleEmailSubmit}
                disabled={isSubmitting}
              >
                <div className="[font-family:'DM_Mono',Helvetica] font-normal text-white text-sm tracking-[0.56px] leading-[normal] whitespace-nowrap">
                  {isSubmitting ? '...' : 'SEND'}
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom status bar with animation */}
        <div className="absolute w-screen h-[30px] border-t border-llcrouge bottom-0 left-0 overflow-hidden cursor-default">
          <div className="animate-slide flex cursor-default">
            <img
              className="h-[30px] w-screen object-cover cursor-default"
              alt="Sub header waitlist"
              src="/sub-header-waitlist-1.svg"
            />
            <img
              className="h-[30px] w-screen object-cover cursor-default"
              alt="Sub header waitlist"
              src="/sub-header-waitlist-1.svg"
            />
          </div>
        </div>

        {/* Success Dialog for Email */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="bg-white border border-llcrouge">
            <DialogHeader>
              <DialogTitle className="[font-family:'DM_Mono',Helvetica] font-normal text-llcrouge text-center">
                Thank you for submitting your email!
              </DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Success Dialog for Invitation Code */}
        <Dialog open={showInviteSuccessDialog} onOpenChange={setShowInviteSuccessDialog}>
          <DialogContent className="bg-white border border-llcrouge">
            <DialogHeader>
              <DialogTitle className="[font-family:'DM_Mono',Helvetica] font-normal text-llcrouge text-center">
                Invitation code is correct!
              </DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Error Dialog for Invitation Code */}
        <Dialog open={showInviteErrorDialog} onOpenChange={setShowInviteErrorDialog}>
          <DialogContent className="bg-white border border-llcrouge">
            <DialogHeader>
              <DialogTitle className="[font-family:'DM_Mono',Helvetica] font-normal text-llcrouge text-center">
                Incorrect code, please try again.
              </DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}; 