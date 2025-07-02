import { useState } from 'react';
import { Globe, Wand2, Loader, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InspirationData {
    welcome_note: string;
    places_to_visit: string[];
    foods_to_try: string[];
}

const InspirationCard = ({ content, destination, dates, onStartPlanning, onGoBack }: { content: InspirationData, destination: string, dates: {start: string, end: string}, onStartPlanning: () => void, onGoBack: () => void }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl animate-fade-in">
            <h2 className="text-3xl font-bold text-muted-teal mb-2">{content.welcome_note}</h2>
            <p className="text-gray-600 mb-6">Your trip to {destination} from {dates.start} to {dates.end}</p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-3">Top Places to Visit</h3>
                    <ul className="space-y-2">
                        {content.places_to_visit.map((place: string, index: number) => (
                            <li key={index} className="flex items-center text-gray-700">
                                <Globe className="w-4 h-4 mr-3 text-vibrant-orange" />
                                {place}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-3">Must-Try Foods</h3>
                    <ul className="space-y-2">
                        {content.foods_to_try.map((food: string, index: number) => (
                            <li key={index} className="flex items-center text-gray-700">
                                <Wand2 className="w-4 h-4 mr-3 text-soft-orange" />
                                {food}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3">
                <button onClick={onGoBack} className="w-full sm:w-auto flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all">
                  <ArrowLeft className="w-5 h-5 inline-block mr-2" />
                  Search Again
                </button>
                <button onClick={onStartPlanning} className="w-full sm:w-auto flex-1 bg-vibrant-orange text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-all">
                  Let's Do It! Start Planning
                </button>
            </div>
        </div>
    );
};


export default function Home({ addTrip }: { addTrip: (newTrip: any) => Promise<string> }) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inspiration, setInspiration] = useState<InspirationData | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGetInspiration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setInspiration(null);

    // 1. Use the OpenAI API key from your environment variables
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    // 2. Use the OpenAI API endpoint
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    const prompt = `You are a helpful travel assistant. Your goal is to provide travel suggestions for a trip to ${destination} from ${startDate} to ${endDate}. Your entire response must be a single, valid JSON object. The JSON object must contain three keys: "welcome_note" (a string), "places_to_visit" (an array of 5 strings), and "foods_to_try" (an array of 5 strings). Do not include any text or formatting outside of the JSON object itself.`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        // 3. Update the request body for the OpenAI API
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // Or another suitable model
          messages: [
            { role: "system", content: "You are a travel assistant that only responds with JSON." },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" } // 4. Enable JSON mode
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      
      // 5. Directly parse the JSON content from the response
      const content = JSON.parse(data.choices[0].message.content);
      
      setInspiration(content);

    } catch (err: any) {
        console.error(err);
        setError(`Sorry, we couldn't get inspiration. Error: ${err.message}`);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleStartPlanning = async () => {
    if (!inspiration) return;

    const newTrip = {
      name: destination,
      description: `Trip to ${destination} from ${startDate} to ${endDate}`,
      createdAt: new Date(),
      participants: [],
      expenses: [],
      inspiration: {
        places: inspiration.places_to_visit,
        foods: inspiration.foods_to_try,
      }
    };

    try {
      const newTripId = await addTrip(newTrip);
      navigate(`/trip-planner/${newTripId}`);
    } catch (error) {
      console.error("Failed to create trip:", error);
      setError("Could not create the trip. Please try again.");
    }
  };
  
  const handleGoBack = () => {
    setInspiration(null);
    setDestination('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center p-4">
        {!inspiration ? (
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-muted-teal mb-2">Where to next?</h1>
                    <p className="text-gray-600">Tell us your dream destination to get started.</p>
                </div>
                <form onSubmit={handleGetInspiration} className="space-y-4 bg-white p-8 rounded-2xl shadow-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text" value={destination} onChange={(e) => setDestination(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-orange"
                                placeholder="e.g., Varanasi" required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-orange" required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-orange" required
                            />
                        </div>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-vibrant-orange text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-all flex items-center justify-center disabled:bg-opacity-50"
                    >
                        {isLoading ? (
                            <Loader className="animate-spin w-5 h-5 mr-2" />
                        ) : (
                            <Wand2 className="w-5 h-5 mr-2" />
                        )}
                        {isLoading ? 'Conjuring Ideas...' : 'Get Inspired'}
                    </button>
                </form>
            </div>
        ) : (
            <InspirationCard 
                content={inspiration} 
                destination={destination}
                dates={{start: startDate, end: endDate}}
                onStartPlanning={handleStartPlanning}
                onGoBack={handleGoBack}
            />
        )}
    </div>
  );
}