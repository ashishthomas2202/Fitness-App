"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Upload,
  Camera,
  Scale,
  Ruler,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  subMonths,
  addMonths,
  subWeeks,
  addWeeks,
  subYears,
  addYears,
  isBefore,
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { usePhotos } from "@/hooks/usePhotos";
import { useMeasurements } from "@/hooks/useMeasurements";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/Alert-dialog";
import { PhotoFullscreenView } from "@/components/PhotoFullscreenView";
import { PhotoComparisonView } from "@/components/PhotoComparisonView";

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState("weight");
  const [weightData, setWeightData] = useState([]);
  const [weight, setWeight] = useState("");
  const [measurements, setMeasurements] = useState({
    chest: "",
    waist: "",
    hips: "",
    biceps: "",
    thighs: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dateView, setDateView] = useState("month");
  const [selectedPeriod, setSelectedPeriod] = useState(new Date());
  const [filteredWeightData, setFilteredWeightData] = useState([]);
  const [measurementDateView, setMeasurementDateView] = useState("month");
  const [measurementSelectedPeriod, setMeasurementSelectedPeriod] = useState(
    new Date()
  );
  const [filteredMeasurementData, setFilteredMeasurementData] = useState([]);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [isMeasurementDeleteDialogOpen, setIsMeasurementDeleteDialogOpen] =
    useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [selectedBeforeAfter, setSelectedBeforeAfter] = useState({
    before: null,
    after: null,
  });
  const [photoNote, setPhotoNote] = useState("");

  const {
    photos,
    photoHistory,
    loading: photosLoading,
    error: photosError,
    handlePhotoUpload,
    updatePhotoNote,
    deletePhoto,
  } = usePhotos();

  const {
    measurements: measurementHistory,
    loading: measurementsLoading,
    error: measurementsError,
    addMeasurement,
    deleteMeasurement,
    fetchMeasurements,
    updateMeasurement,
  } = useMeasurements();

  useEffect(() => {
    fetchWeightHistory();
  }, []);

  useEffect(() => {
    if (!measurementHistory?.length) return;

    let startDate, endDate;
    switch (measurementDateView) {
      case "week":
        startDate = startOfWeek(measurementSelectedPeriod, { weekStartsOn: 0 });
        endDate = endOfWeek(measurementSelectedPeriod, { weekStartsOn: 0 });
        break;
      case "month":
        startDate = startOfMonth(measurementSelectedPeriod);
        endDate = endOfMonth(measurementSelectedPeriod);
        break;
      case "year":
        startDate = startOfYear(measurementSelectedPeriod);
        endDate = endOfYear(measurementSelectedPeriod);
        break;
      default:
        startDate = startOfMonth(measurementSelectedPeriod);
        endDate = endOfMonth(measurementSelectedPeriod);
    }

    const filtered = measurementHistory
      .filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= startDate && recordDate <= endDate;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setFilteredMeasurementData(filtered);
  }, [measurementHistory, measurementDateView, measurementSelectedPeriod]);

  useEffect(() => {
    if (weightData.length === 0) return;

    let startDate, endDate;
    switch (dateView) {
      case "week":
        startDate = startOfWeek(selectedPeriod, { weekStartsOn: 0 });
        endDate = endOfWeek(selectedPeriod, { weekStartsOn: 0 });
        break;
      case "month":
        startDate = startOfMonth(selectedPeriod);
        endDate = endOfMonth(selectedPeriod);
        break;
      case "year":
        startDate = startOfYear(selectedPeriod);
        endDate = endOfYear(selectedPeriod);
        break;
      default:
        startDate = startOfMonth(selectedPeriod);
        endDate = endOfMonth(selectedPeriod);
    }

    console.log("Date Range:", { startDate, endDate }); // Debug log

    const filtered = weightData
      .filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= startDate && recordDate <= endDate;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setFilteredWeightData(filtered);
  }, [weightData, dateView, selectedPeriod]);

  const fetchWeightHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/record/weight");
      const data = await response.json();
      if (data.success) {
        const sortedData = data.data.map((record) => {
          const date = new Date(record.date);
          return {
            _id: record._id,
            date: date,
            dateString: format(date, "MMM d"),
            fullDate: format(date, "MMM d, yyyy"),
            weight: record.weight,
          };
        });

        setWeightData(sortedData);
      }
    } catch (err) {
      setError("Failed to load weight history");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWeightSubmit = async (e) => {
    e.preventDefault();
    const weightValue = parseFloat(weight);
    console.log("Weight value:", weightValue); // Debug log

    if (!weight || weightValue <= 0) {
      setError("Weight must be greater than 0");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const submitDate = new Date(selectedDate);
      submitDate.setHours(12, 0, 0, 0);

      const weightData = {
        weight: weightValue,
        date: submitDate.toISOString(),
        unit: "lbs",
      };
      console.log("Weight data being sent:", weightData); // Debug log

      const response = await fetch("/api/record/weight/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(weightData),
      });

      const data = await response.json();
      console.log("Response from server:", data); // Debug log

      if (data.success) {
        setWeight("");
        await fetchWeightHistory();
      } else {
        setError(data.message || "Failed to save weight");
      }
    } catch (err) {
      console.error("Submit error details:", err); // More detailed error log
      setError("Failed to save weight");
    } finally {
      setLoading(false);
    }
  };

  const deleteWeight = async (weightId) => {
    if (!weightId) {
      console.error("No weight ID provided");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/record/weight/${weightId}/delete`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        return true;
      } else {
        setError(data.message || "Failed to delete weight");
        return false;
      }
    } catch (err) {
      setError("Failed to delete weight");
      console.error("Delete error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleMeasurementsSubmit = async (e) => {
    e.preventDefault();
    const hasInvalidMeasurements = Object.values(measurements).some(
      (value) => value && parseFloat(value) <= 0
    );

    if (hasInvalidMeasurements) {
      setError("All measurements must be greater than 0");
      return;
    }

    const validMeasurements = Object.fromEntries(
      Object.entries(measurements).filter(([_, value]) => value !== "")
    );

    if (Object.keys(validMeasurements).length === 0) {
      setError("Please enter at least one measurement");
      return;
    }

    const success = await addMeasurement(validMeasurements, selectedDate);
    if (success) {
      setMeasurements({
        chest: "",
        waist: "",
        hips: "",
        biceps: "",
        thighs: "",
      });
    }
  };

  if (loading || photosLoading || measurementsLoading) {
    return <LoadingSpinner />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "weight":
        return (
          <Card className="dark:bg-neutral-900">
            <CardHeader>
              <CardTitle>Weight Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleWeightSubmit} className="mb-6">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 items-start">
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={weight}
                      onChange={(e) => {
                        setError(null);
                        const value = parseFloat(e.target.value);
                        if (value > 0) {
                          setWeight(e.target.value);
                        }
                      }}
                      placeholder="Enter weight (lbs)"
                      className="flex-1 dark:bg-neutral-800"
                    />
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      maxDate={new Date()}
                      dateFormat="MMM d, yyyy"
                      className="w-[150px]"
                      customInput={
                        <Input
                          type="text"
                          className="w-[150px] dark:bg-neutral-800"
                        />
                      }
                    />
                    <Button
                      type="submit"
                      className="whitespace-nowrap py-6 "
                      disabled={loading}
                    >
                      Log Weight
                    </Button>
                  </div>
                </div>
              </form>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDateView("week")}
                    className={`${
                      dateView === "week"
                        ? "bg-purple-100 dark:bg-purple-900 border-purple-500 dark:text-white"
                        : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    Week
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDateView("month")}
                    className={`${
                      dateView === "month"
                        ? "bg-purple-100 dark:bg-purple-900 border-purple-500 dark:text-white"
                        : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    Month
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDateView("year")}
                    className={`${
                      dateView === "year"
                        ? "bg-purple-100 dark:bg-purple-900 border-purple-500 dark:text-white"
                        : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    Year
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      switch (dateView) {
                        case "week":
                          setSelectedPeriod((prevDate) =>
                            subWeeks(prevDate, 1)
                          );
                          break;
                        case "month":
                          setSelectedPeriod((prevDate) =>
                            subMonths(prevDate, 1)
                          );
                          break;
                        case "year":
                          setSelectedPeriod((prevDate) =>
                            subYears(prevDate, 1)
                          );
                          break;
                      }
                    }}
                    className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <DatePicker
                    selected={selectedPeriod}
                    onChange={(date) => setSelectedPeriod(date)}
                    dateFormat={dateView === "year" ? "yyyy" : "MMM yyyy"}
                    showMonthYearPicker={dateView === "month"}
                    showYearPicker={dateView === "year"}
                    customInput={
                      <Button
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 min-w-[120px]"
                      >
                        {format(
                          selectedPeriod,
                          dateView === "week"
                            ? "'Week of' MMM d"
                            : dateView === "month"
                            ? "MMMM yyyy"
                            : "yyyy"
                        )}
                      </Button>
                    }
                  />

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const today = new Date();
                      switch (dateView) {
                        case "week":
                          if (isBefore(selectedPeriod, today))
                            setSelectedPeriod((prevDate) =>
                              addWeeks(prevDate, 1)
                            );
                          break;
                        case "month":
                          if (isBefore(endOfMonth(selectedPeriod), today))
                            setSelectedPeriod((prevDate) =>
                              addMonths(prevDate, 1)
                            );
                          break;
                        case "year":
                          if (isBefore(endOfYear(selectedPeriod), today))
                            setSelectedPeriod((prevDate) =>
                              addYears(prevDate, 1)
                            );
                          break;
                      }
                    }}
                    className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredWeightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="dateString"
                      type="category"
                      padding={{ left: 20, right: 20 }}
                    />
                    <YAxis
                      domain={["dataMin - 5", "dataMax + 5"]}
                      padding={{ top: 20, bottom: 20 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgb(31 41 55)",
                        color: "white",
                        border: "1px solid rgb(75 85 99)",
                      }}
                      formatter={(value) => [`${value} lbs`, "Weight"]}
                      labelFormatter={(value) => value}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={(props) => {
                        if (!props.payload) return null;
                        const { cx, cy, payload } = props;
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={4}
                            fill="#8b5cf6"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedWeight({
                                _id: payload._id,
                                fullDate: payload.fullDate,
                                weight: payload.weight,
                              });
                              setIsDeleteDialogOpen(true);
                            }}
                          />
                        );
                      }}
                      activeDot={(props) => {
                        if (!props.payload) return null;
                        const { cx, cy, payload } = props;
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={6}
                            fill="white"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedWeight({
                                _id: payload._id,
                                fullDate: payload.fullDate,
                                weight: payload.weight,
                              });
                              setIsDeleteDialogOpen(true);
                            }}
                          />
                        );
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogContent className="dark:bg-gray-800 dark:text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="dark:text-white">
                      Delete Weight Entry
                    </AlertDialogTitle>
                    <AlertDialogDescription className="dark:text-gray-300">
                      Are you sure you want to delete the weight entry for{" "}
                      {selectedWeight?.fullDate}?
                      <div className="mt-2 p-4 bg-gray-100 dark:bg-gray-900 rounded-md">
                        <span className="font-medium dark:text-white">
                          {selectedWeight?.weight} lbs
                        </span>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700"
                      onClick={async () => {
                        if (selectedWeight?._id) {
                          await deleteWeight(selectedWeight._id);
                          setIsDeleteDialogOpen(false);
                          const updatedFilteredData = filteredWeightData.filter(
                            (w) => w._id !== selectedWeight._id
                          );
                          setFilteredWeightData(updatedFilteredData);
                          const updatedWeightData = weightData.filter(
                            (w) => w._id !== selectedWeight._id
                          );
                          setWeightData(updatedWeightData);
                        }
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        );
      case "photos":
        return (
          <Card className="dark:bg-neutral-900">
            <CardHeader>
              <CardTitle>Progress Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["front", "side", "back"].map((view) => (
                  <div key={view} className="space-y-2">
                    <label className="block text-sm font-medium capitalize">
                      {view} View
                    </label>
                    <div className="relative aspect-square border-2 border-dashed rounded-lg">
                      {photos[view] ? (
                        <div className="space-y-2">
                          <div className="relative group h-full">
                            <div
                              className="w-full h-full cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedPhoto(photos[view]);
                                setIsFullscreenOpen(true);
                              }}
                            >
                              <img
                                src={photos[view].imageUrl}
                                alt={`${view} view`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all z-10"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                deletePhoto(photos[view].id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <label className="block w-full h-full cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handlePhotoUpload(view, e.target.files[0])
                            }
                          />
                          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                            <Upload className="h-8 w-8 mb-2" />
                            <span className="text-sm">Upload {view} view</span>
                          </div>
                        </label>
                      )}
                    </div>
                    {photos[view] && (
                      <div className="mt-2">
                        <Input
                          placeholder="Add a note..."
                          value={photos[view].note || ""}
                          onChange={async (e) => {
                            const success = await updatePhotoNote(
                              photos[view].id,
                              e.target.value
                            );
                            if (!success) {
                              setError("Failed to update note");
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Photo History</h3>
                  <Button
                    variant="outline"
                    className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={() => setIsComparisonOpen(true)}
                  >
                    Compare Photos
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photoHistory.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <div
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedPhoto(photo);
                          setIsFullscreenOpen(true);
                        }}
                      >
                        <img
                          src={photo.imageUrl}
                          alt={`Progress ${format(
                            new Date(photo.date),
                            "MMM d, yyyy"
                          )}`}
                          className="aspect-square object-cover rounded-lg"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deletePhoto(photo.id, true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {photo.note && (
                        <p className="mt-1 text-sm text-gray-500 truncate">
                          {photo.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <PhotoFullscreenView
                isOpen={isFullscreenOpen}
                onClose={() => setIsFullscreenOpen(false)}
                photo={selectedPhoto}
              />

              <PhotoComparisonView
                isOpen={isComparisonOpen}
                onClose={() => setIsComparisonOpen(false)}
                photoHistory={photoHistory}
              />
            </CardContent>
          </Card>
        );

      case "measurements":
        return (
          <Card className="dark:bg-neutral-900">
            <CardHeader>
              <CardTitle>Body Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMeasurementsSubmit} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(measurements).map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium capitalize mb-1 dark:text-gray-300">
                        {key} (inches)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={measurements[key]}
                        onChange={(e) => {
                          setError(null);
                          const value = parseFloat(e.target.value);
                          if (value > 0 || e.target.value === "") {
                            setMeasurements((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }));
                          }
                        }}
                        placeholder={`Enter ${key} measurement`}
                        className="dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:placeholder-neutral-400"
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 items-start">
                  {" "}
                  <div className="flex-1">
                    <form
                      onSubmit={handleMeasurementsSubmit}
                      className="mb-6"
                    ></form>
                  </div>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    maxDate={new Date()}
                    dateFormat="MMM d, yyyy"
                    className="w-[150px]"
                    customInput={
                      <Input
                        type="text"
                        className="w-[150px] dark:bg-neutral-900 dark:text-white dark:border-gray-600"
                      />
                    }
                  />
                  <Button type="submit" className="whitespace-nowrap py-6">
                    Log Measurements
                  </Button>
                </div>
              </form>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMeasurementDateView("week")}
                    className={`${
                      measurementDateView === "week"
                        ? "bg-purple-100 dark:bg-purple-900 border-purple-500 dark:text-white"
                        : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    Week
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMeasurementDateView("month")}
                    className={`${
                      measurementDateView === "month"
                        ? "bg-purple-100 dark:bg-purple-900 border-purple-500 dark:text-white"
                        : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    Month
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMeasurementDateView("year")}
                    className={`${
                      measurementDateView === "year"
                        ? "bg-purple-100 dark:bg-purple-900 border-purple-500 dark:text-white"
                        : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    Year
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      switch (measurementDateView) {
                        case "week":
                          setMeasurementSelectedPeriod((prevDate) =>
                            subWeeks(prevDate, 1)
                          );
                          break;
                        case "month":
                          setMeasurementSelectedPeriod((prevDate) =>
                            subMonths(prevDate, 1)
                          );
                          break;
                        case "year":
                          setMeasurementSelectedPeriod((prevDate) =>
                            subYears(prevDate, 1)
                          );
                          break;
                      }
                    }}
                    className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <DatePicker
                    selected={measurementSelectedPeriod}
                    onChange={(date) => setMeasurementSelectedPeriod(date)}
                    dateFormat={
                      measurementDateView === "year" ? "yyyy" : "MMM yyyy"
                    }
                    showMonthYearPicker={measurementDateView === "month"}
                    showYearPicker={measurementDateView === "year"}
                    customInput={
                      <Button
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 min-w-[120px]"
                      >
                        {format(
                          measurementSelectedPeriod,
                          measurementDateView === "week"
                            ? "'Week of' MMM d"
                            : measurementDateView === "month"
                            ? "MMMM yyyy"
                            : "yyyy"
                        )}
                      </Button>
                    }
                  />

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const today = new Date();
                      switch (measurementDateView) {
                        case "week":
                          if (isBefore(measurementSelectedPeriod, today))
                            setMeasurementSelectedPeriod((prevDate) =>
                              addWeeks(prevDate, 1)
                            );
                          break;
                        case "month":
                          if (
                            isBefore(
                              endOfMonth(measurementSelectedPeriod),
                              today
                            )
                          )
                            setMeasurementSelectedPeriod((prevDate) =>
                              addMonths(prevDate, 1)
                            );
                          break;
                        case "year":
                          if (
                            isBefore(
                              endOfYear(measurementSelectedPeriod),
                              today
                            )
                          )
                            setMeasurementSelectedPeriod((prevDate) =>
                              addYears(prevDate, 1)
                            );
                          break;
                      }
                    }}
                    className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {measurementHistory?.length > 0 && (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredMeasurementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) =>
                          format(new Date(date), "MMM d")
                        }
                      />
                      <YAxis
                        domain={[0, "auto"]}
                        padding={{ top: 20, bottom: 20 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgb(31 41 55)",
                          color: "white",
                          border: "1px solid rgb(75 85 99)",
                          padding: "12px",
                        }}
                        labelFormatter={(value) =>
                          format(new Date(value), "MMM d, yyyy")
                        }
                        formatter={(value, name) => [`${value} inches`, name]}
                      />
                      {[
                        { key: "chest", color: "#ef4444", name: "Chest" },
                        { key: "waist", color: "#3b82f6", name: "Waist" },
                        { key: "hips", color: "#10b981", name: "Hips" },
                        { key: "biceps", color: "#8b5cf6", name: "Biceps" },
                        { key: "thighs", color: "#f59e0b", name: "Thighs" },
                      ].map((item) => (
                        <Line
                          key={item.key}
                          type="monotone"
                          dataKey={`measurements.${item.key}`}
                          stroke={item.color}
                          name={item.name}
                          strokeWidth={2}
                          connectNulls={true}
                          dot={(props) => {
                            if (
                              !props.payload ||
                              props.payload.measurements?.[item.key] ===
                                undefined ||
                              props.payload.measurements?.[item.key] === null
                            ) {
                              return null;
                            }
                            return (
                              <circle
                                cx={props.cx}
                                cy={props.cy}
                                r={4}
                                fill={item.color}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setSelectedMeasurement({
                                    _id: props.payload._id,
                                    fullDate: format(
                                      new Date(props.payload.date),
                                      "MMM d, yyyy"
                                    ),
                                    ...props.payload.measurements,
                                  });
                                  setIsMeasurementDeleteDialogOpen(true);
                                }}
                              />
                            );
                          }}
                          activeDot={(props) => {
                            if (
                              !props.payload ||
                              props.payload.measurements?.[item.key] ===
                                undefined ||
                              props.payload.measurements?.[item.key] === null
                            ) {
                              return null;
                            }
                            return (
                              <circle
                                cx={props.cx}
                                cy={props.cy}
                                r={6}
                                fill="white"
                                stroke={item.color}
                                strokeWidth={2}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setSelectedMeasurement({
                                    _id: props.payload._id,
                                    fullDate: format(
                                      new Date(props.payload.date),
                                      "MMM d, yyyy"
                                    ),
                                    ...props.payload.measurements,
                                  });
                                  setIsMeasurementDeleteDialogOpen(true);
                                }}
                              />
                            );
                          }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <AlertDialog
                open={isMeasurementDeleteDialogOpen}
                onOpenChange={setIsMeasurementDeleteDialogOpen}
              >
                <AlertDialogContent className="dark:bg-gray-800 dark:text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="dark:text-white">
                      Delete Measurement Entry
                    </AlertDialogTitle>
                    <AlertDialogDescription className="dark:text-gray-300">
                      Select measurements to delete:
                      <div className="mt-4 space-y-2">
                        {Object.entries(selectedMeasurement || {}).map(
                          ([key, value]) => {
                            if (key !== "_id" && key !== "fullDate") {
                              return (
                                <div
                                  key={key}
                                  className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-900 rounded-md"
                                >
                                  <span className="capitalize">
                                    {key}: {value} inches
                                  </span>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={async () => {
                                      console.log("Deleting field:", key); // Debug log
                                      const success = await updateMeasurement(
                                        selectedMeasurement._id,
                                        key
                                      );
                                      if (success) {
                                        setIsMeasurementDeleteDialogOpen(false);
                                        await fetchMeasurements();
                                      }
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              );
                            }
                            return null;
                          }
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t dark:border-gray-700">
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={async () => {
                            if (selectedMeasurement?._id) {
                              const success = await deleteMeasurement(
                                selectedMeasurement._id
                              );
                              if (success) {
                                setIsMeasurementDeleteDialogOpen(false);
                                await fetchMeasurements();
                              }
                            }
                          }}
                        >
                          Delete All Measurements for this Date
                        </Button>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900">
                      Cancel
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Progress Tracker</h1>

      <div className="flex space-x-1 mb-8 bg-white dark:bg-neutral-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("weight")}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md flex-1 transition-colors ${
            activeTab === "weight"
              ? "bg-neutral-100 dark:bg-neutral-950 shadow-sm"
              : "hover:bg-neutral-50 dark:hover:bg-neutral-900"
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Weight</span>
        </button>
        <button
          onClick={() => setActiveTab("photos")}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md flex-1 transition-colors ${
            activeTab === "photos"
              ? "bg-neutral-100 dark:bg-neutral-950 shadow-sm"
              : "hover:bg-neutral-50 dark:hover:bg-neutral-900"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Photos</span>
        </button>
        <button
          onClick={() => setActiveTab("measurements")}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md flex-1 transition-colors ${
            activeTab === "measurements"
              ? "bg-neutral-100 dark:bg-neutral-950 shadow-sm"
              : "hover:bg-neutral-50 dark:hover:bg-neutral-900"
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>Measurements</span>
        </button>
      </div>

      {renderContent()}
    </div>
  );
}
