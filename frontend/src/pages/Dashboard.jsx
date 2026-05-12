import { useState } from "react";
import API from "../api/api";

export default function Dashboard() {

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState(null);

  const [result, setResult] = useState(null);

  const [language, setLanguage] = useState("en");

  const translations = {

    en: {
      title: "Livestock AI Dashboard",
      upload: "Upload Livestock Image",
      predict: "Predict Disease",
      result: "AI Prediction Result",
      precaution: "Precaution Measures",
      nearbyVet: "Nearby Veterinary Hospitals",
      emergency: "Emergency Alert",
      noResult: "Upload image to see prediction result",
    },

    kn: {
      title: "ಪಶು AI ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      upload: "ಪಶುವಿನ ಚಿತ್ರ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
      predict: "ರೋಗವನ್ನು ಊಹಿಸಿ",
      result: "AI ಫಲಿತಾಂಶ",
      precaution: "ಮುನ್ನೆಚ್ಚರಿಕೆ ಕ್ರಮಗಳು",
      nearbyVet: "ಹತ್ತಿರದ ಪಶುವೈದ್ಯ ಆಸ್ಪತ್ರೆಗಳು",
      emergency: "ತುರ್ತು ಎಚ್ಚರಿಕೆ",
      noResult: "ಫಲಿತಾಂಶ ನೋಡಲು ಚಿತ್ರ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
    },

    hi: {
      title: "पशुधन AI डैशबोर्ड",
      upload: "पशु की तस्वीर अपलोड करें",
      predict: "रोग की पहचान करें",
      result: "AI परिणाम",
      precaution: "सावधानी उपाय",
      nearbyVet: "नजदीकी पशु चिकित्सालय",
      emergency: "आपातकालीन अलर्ट",
      noResult: "परिणाम देखने के लिए तस्वीर अपलोड करें",
    }
  };

  const t = translations[language];

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {

    if (!image) {

      alert("Please select image");

      return;
    }

    const formData = new FormData();

    formData.append("image", image);

    try {

      const response = await API.post(
        "/predict",
        formData
      );

      setResult(response.data);

    } catch (error) {

      console.log(error);

      alert("Prediction failed");
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100">

      {/* Navbar */}

      <div className="bg-green-700 text-white p-5 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 shadow-lg">

        <h1 className="text-3xl font-bold">
          {t.title}
        </h1>

        <div className="flex gap-4 items-center">

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-black px-3 py-2 rounded-lg"
          >

            <option value="en">English</option>

            <option value="kn">Kannada</option>

            <option value="hi">Hindi</option>

          </select>

          <button
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Logout
          </button>

        </div>

      </div>

      {/* Main Content */}

      <div className="p-8 flex flex-col lg:flex-row gap-8">

        {/* Upload Section */}

        <div className="bg-white p-8 rounded-3xl shadow-xl w-full lg:w-1/2">

          <h2 className="text-3xl font-bold text-green-700 mb-6">
            {t.upload}
          </h2>

          <input
            type="file"
            onChange={handleImageChange}
            className="mb-5"
          />

          {preview && (

            <img
              src={preview}
              alt="Preview"
              className="w-full h-72 object-cover rounded-2xl mb-5 border"
            />

          )}

          <button
            onClick={handleUpload}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-semibold text-lg transition"
          >
            {t.predict}
          </button>

          <button
            onClick={() => {
              window.open(
                "https://www.google.com/maps/search/veterinary+hospital+near+me"
              );
            }}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold"
          >
            {t.nearbyVet}
          </button>

          <button
            onClick={() => {
              alert(
                "Emergency alert sent to nearby veterinary support."
              );
            }}
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl font-semibold"
          >
            {t.emergency}
          </button>

        </div>

        {/* Result Section */}

        <div className="bg-white p-8 rounded-3xl shadow-xl w-full lg:w-1/2">

          <h2 className="text-3xl font-bold text-green-700 mb-6">
            {t.result}
          </h2>

          {!result ? (

            <div className="text-gray-500 mt-20 text-center">
              {t.noResult}
            </div>

          ) : (

            <div>

              <div className="bg-green-100 p-6 rounded-2xl mb-5">

                <h3 className="text-2xl font-bold text-green-800">
                  {result.prediction}
                </h3>

                <p className="mt-3 text-lg text-gray-700">

                  Confidence:

                  <span className="font-bold text-green-700 ml-2">
                    {result.confidence}%
                  </span>

                </p>

              </div>

              <div className="bg-gray-100 p-5 rounded-2xl">

                <h4 className="text-xl font-bold mb-3">
                  {t.precaution}
                </h4>

                <p className="text-gray-700 leading-7">
                  {result.precaution}
                </p>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}