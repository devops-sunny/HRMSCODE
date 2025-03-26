import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

interface OTPFormData {
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  otp5: string;
  otp6: string;
}

const OTPForm: React.FC = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<OTPFormData>();
  const [timer, setTimer] = useState<number>(300);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const resetOTP = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(300);
  };

  const onSubmit = (data: OTPFormData) => {
    console.log("Submitted Data: ", data);
    alert("Form Submitted Successfully!");
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    setOtp(pastedData);
    pastedData.forEach((val, index) => setValue(`otp${index + 1}` as keyof OTPFormData, val));
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setValue(`otp${index + 1}` as keyof OTPFormData, value);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="container-fuild">
        <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
          <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
            <div className="col-md-4 mx-auto vh-100">
              <form onSubmit={handleSubmit(onSubmit)} className="digit-group vh-100">
                <div className="vh-100 d-flex flex-column justify-content-between p-4 pb-0">
                  <div className="mx-auto mb-5 text-center">
                    <img src="assets/img/logo.svg" className="img-fluid" alt="Logo" />
                  </div>
                  <div>
                    <div className="text-center mb-3">
                      <h2 className="mb-2">2 Step Verification</h2>
                      <p className="mb-0">Please enter the OTP received to confirm your account ownership. A code has been sent to ******doe@example.com</p>
                    </div>
                    <div className="text-center otp-input">
                      <div className="d-flex align-items-center mb-3">
                        {[...Array(6)].map((_, index) => (
                          <input
                            key={index}
                            type="text"
                            className="rounded w-100 py-sm-3 py-2 text-center fs-26 fw-bold me-3"
                            maxLength={1}
                            {...register(`otp${index + 1}` as keyof OTPFormData, { required: "Required" })}
                            value={otp[index]}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onPaste={index === 0 ? handlePaste : undefined}
                          />
                        ))}
                      </div>
                      <div>
                        <div className="badge bg-danger-transparent mb-3">
                          <p className="d-flex align-items-center "><i className="ti ti-clock me-1"></i>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</p>
                        </div>
                        <div className="mb-3 d-flex justify-content-center">
                          <p className="text-gray-9">Didn't get the OTP? <a href="javascript:void(0);" className="text-primary" onClick={resetOTP}>Resend OTP</a></p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <button type="submit" className="btn btn-primary w-100">Verify &amp; Proceed</button>
                    </div>
                  </div>
                  <div className="mt-5 pb-4 text-center">
                    <p className="mb-0 text-gray-9">Copyright © 2024 - Smarthr</p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPForm;
