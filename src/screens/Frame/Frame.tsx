import React, { useState, useRef, useEffect } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
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

export const Frame = (): JSX.Element => {
  const [invitationCode, setInvitationCode] = useState<string[]>(Array(6).fill(''));
  const [email, setEmail] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showInviteSuccessDialog, setShowInviteSuccessDialog] = useState(false);
  const [showInviteErrorDialog, setShowInviteErrorDialog] = useState(false);
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [currentTime, setCurrentTime] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const time = new Date().toLocaleTimeString('en-US', {
        timeZone: selectedCity.timezone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(time);
    };

    updateTime(); // Initial update
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [selectedCity]);

  const handleCodeChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only letters and numbers
    if (!/^[A-Za-z0-9]$/.test(value) && value !== '') return;

    const newCode = [...invitationCode];
    newCode[index] = value.toUpperCase();
    setInvitationCode(newCode);
    console.log('Typing invitation code:', newCode.join(''));

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !invitationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const code = invitationCode.join('');
    console.log('Submitted invitation code:', code);

    // Check if code is complete (all 6 characters filled)
    if (code.length !== 6 || invitationCode.some(char => char === '')) {
      setInvitationCode(Array(6).fill('')); // Clear inputs
      setShowInviteErrorDialog(true);
      
      // Auto close error dialog after 10 seconds
      setTimeout(() => {
        setShowInviteErrorDialog(false);
      }, 10000);
      return;
    }

    // Code is complete, show success
    setInvitationCode(Array(6).fill('')); // Clear inputs
    setShowInviteSuccessDialog(true);
    
    // Auto close success dialog after 10 seconds
    setTimeout(() => {
      setShowInviteSuccessDialog(false);
    }, 10000);
  };

  const handleEmailSubmit = async () => {
    // Basic email validation
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
      
      // Auto close dialog after 10 seconds
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
    <div className="bg-transparent w-full h-screen overflow-hidden">
      <div className="w-full h-full">
        <div className="w-full h-full bg-white relative">
          <div className="w-full h-full relative">
            {/* Vertical divider */}
            <Separator
              orientation="vertical"
              className="w-px h-full top-0 left-[559px] absolute border-r border-llcrouge"
            />

            {/* Bottom section with invitation code and waitlist */}
            <div className="absolute right-0 left-[560px] h-[235px] top-[428px]">
              <div className="absolute w-full border-t border-b border-llcrouge h-[235px] top-0 left-0 z-[5]">
                {/* Invitation code section */}
                <div className="absolute w-[278px] h-[156px] top-[60px] left-20">
                  <div className="absolute w-[126px] h-2.5 top-0 left-0 [font-family:'DM_Mono',Helvetica] font-normal text-[#fe240b] text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                    INVITATION CODE
                  </div>

                  {/* Invitation code input boxes */}
                  <div className="flex gap-2 absolute top-[27px] left-0">
                    {Array(5).fill(null).map((_, index) => (
                      <div
                        key={index}
                        className="w-[35px] h-[59px] flex items-center justify-center rounded-[5px] border border-solid border-[#fe240b]"
                      >
                        <input
                          ref={el => inputRefs.current[index] = el}
                          type="text"
                          value={invitationCode[index]}
                          onChange={(e) => handleCodeChange(index, e)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-6 z-10 h-8 bg-transparent text-center text-[#fe240b] [font-family:'DM_Mono',Helvetica] font-normal text-2xl outline-none"
                          maxLength={1}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Last box with hover effect */}
                  <div className="absolute w-[71px] ml-2.5 h-[129px] top-[27px] left-[205px]">
                    <div className="w-[35px] z-10 h-[59px] flex items-center justify-center rounded-[5px] border border-solid border-[#fe240b]">
                      <input
                        ref={el => inputRefs.current[5] = el}
                        type="text"
                        value={invitationCode[5]}
                        onChange={(e) => handleCodeChange(5, e)}
                        onKeyDown={(e) => handleKeyDown(5, e)}
                        className="w-6 z-10 h-8 bg-transparent text-center text-[#fe240b] [font-family:'DM_Mono',Helvetica] font-normal text-2xl outline-none"
                        maxLength={1}
                      />
                  {/* 
                    <img
                      className="absolute w-14 h-[86px] top-[43px] left-[15px]"
                      alt="Hover magic"
                      src="/hover-magic.svg"
                    />
                  */}  </div>
                  </div>

                  {/* OK button */}
                  <Button 
                    onClick={handleSubmit}
                    className="absolute top-[104px] left-0 bg-llcrouge hover:bg-[rgb(204,29,9)] rounded-[5px] h-auto p-2.5 z-10 transition-colors"
                  >
                    <span className="[font-family:'DM_Mono',Helvetica] font-normal text-white text-sm tracking-[0.56px] leading-[normal] whitespace-nowrap">
                      OK
                    </span>
                  </Button>
                </div>

                {/* Divider with OR */}
                <div className="absolute w-screen h-[235px] top-0 -right-[560px]">
                  <div className="absolute w-[49px] h-[235px] top-0 left-[375px]">
                    <div className="relative w-[51px] h-[235px]">
                      <Separator
                        orientation="vertical"
                        className="w-px h-[235px] border-r border-llcrouge top-0 left-6 absolute"
                      />
                      <Badge className="absolute w-[47px] h-[45px] top-[95px] left-0.5 rotate-[-5deg] bg-white hover:bg-white rounded-[22.5px] border border-solid border-[#fe240b] p-0">
                        <div className="absolute top-3.5 left-[13px] [font-family:'DM_Mono',Helvetica] font-medium text-llcrouge text-sm text-center tracking-[0.28px] leading-[14px] whitespace-nowrap">
                          OR
                        </div>
                      </Badge>
                    </div>
                  </div>
                  <Separator className="w-screen h-px top-0 left-0 absolute border-r border-llcrouge" />
                </div>

                {/* Email waitlist section */}
                <div className="absolute right-20 left-[480px] h-[134px] top-[60px]">
                  <div className="absolute w-full h-2.5 top-0 left-0 [font-family:'DM_Mono',Helvetica] font-normal text-llcrouge text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                    JOIN THE WAITLIST
                  </div>

                  <div className="absolute top-10 left-0 w-full">
                    <Input
                      className="border-t-0 border-l-0 border-r-0 border-b border-llcrouge rounded-none px-0 py-2 [font-family:'DM_Mono',Helvetica] font-normal text-llcrouge text-sm tracking-[0.56px] focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
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

                  <Button 
                    className="absolute top-[104px] left-0 bg-llcrouge hover:bg-[rgb(204,29,9)] rounded-[5px] h-auto p-2.5 w-[62px] transition-colors disabled:opacity-50"
                    onClick={handleEmailSubmit}
                    disabled={isSubmitting}
                  >
                    <span className="[font-family:'DM_Mono',Helvetica] font-normal text-white text-sm tracking-[0.56px] leading-[normal] whitespace-nowrap">
                      {isSubmitting ? '...' : 'SEND'}
                    </span>
                  </Button>
                </div>
              </div>
              <Separator className="w-screen h-px top-[235px] -right-[560px] absolute border-r border-llcrouge" />
            </div>

            {/* Main content section */}
            <div className="absolute w-[602px] h-[274px] top-[94px] left-[640px]">
              <Badge className="absolute w-[135px] h-[45px] top-1.5 left-0.5 bg-white hover:bg-white rounded-[67.5px/22.5px] border border-solid border-[#fe240b] p-0 badge-animate">
                <div className="absolute h-7 top-[7px] left-[27px] [font-family:'DM_Mono',Helvetica] font-medium text-[#fe240b] text-sm text-center tracking-[0.28px] leading-[14px]">
                  SOON IN
                  <br />
                  THE CLUB!
                </div>
              </Badge>

              <h1 className="absolute w-[600px] h-[197px] top-[77px] left-0 [font-family:'DM_Sans',Helvetica] font-normal text-llcrouge text-[40px] tracking-[0] leading-[42px]">
                THE ULTIMATE CURATION OF DURABLE AND TECH-ORIENTED CONSUMER
                PRODUCTS FOR THE MOST DEMANDING INDIVIDUALS.
              </h1>
            </div>

            {/* Logo */}
            <img
              className="absolute w-[417px] ml-12 h-[500px] top-[120px] left-0"
              alt="Life Long Club Logo"
              src="/logo-big.svg"
            />

            {/* Top header */}
            <div className="absolute w-screen h-[30px]  border-b border-llcrouge  top-0 left-0 overflow-hidden">
              <div className="animate-slide flex">
                <img
                  className="h-[30px] w-screen object-cover"
                  alt="Sub header waitlist"
                  src="/sub-header-waitlist.png"
                />
                <img
                  className="h-[30px] w-screen object-cover"
                  alt="Sub header waitlist"
                  src="/sub-header-waitlist.png"
                />
              </div>
            </div>

            {/* Club members badge */}
            <Badge className="absolute z-[20] w-[135px] h-[45px] top-[670px] left-[1228px] bg-transparent hover:bg-transparent rounded-[67.5px/22.5px] border border-solid border-[#fe240b] p-0 badge-animate">
              <div className="absolute h-7 top-[7px] left-[23px] [font-family:'DM_Mono',Helvetica] font-medium text-[#fe240b] text-sm text-center tracking-[0.28px] leading-[14px]">
                +1200 CLUB
                <br />
                MEMBERS
              </div>
            </Badge>

            {/* Time display */}
            <div className="absolute w-32 h-[45px] top-[69px] left-[1320px] [font-family:'DM_Mono',Helvetica] font-normal text-[#fe240b] text-sm tracking-[0] leading-[14px] flex flex-col items-start">
              <Select
                value={selectedCity.name}
                onValueChange={(value) => {
                  const city = CITIES.find(c => c.name === value);
                  if (city) setSelectedCity(city);
                }}
              >
                <SelectTrigger className="w-full border-0 p-0 h-auto shadow-none text-left text-[#fe240b] [font-family:'DM_Mono',Helvetica] font-normal text-sm">
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
              <div className="mt-1">
                {currentTime}
              </div>
            </div>

            {/* Bottom header */}
            <div className="absolute w-screen h-[30px] border-t border-llcrouge bottom-0 left-0 overflow-hidden">
              <div className="animate-slide flex">
                <img
                  className="h-[30px] w-screen object-cover"
                  alt="Sub header waitlist"
                  src="/sub-header-waitlist-1.svg"
                />
                <img
                  className="h-[30px] w-screen object-cover"
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
      </div>
    </div>
  );
};
