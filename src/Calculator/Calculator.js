import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  Box,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  Grid,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import {
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  CurrencyBitcoin as BitcoinIcon,
} from "@mui/icons-material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InfoIcon from "@mui/icons-material/Info";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const countries = [
  { name: "United States", currency: "USD", decimalSeparator: ".", thousandSeparator: "," },
  { name: "United Kingdom", currency: "GBP", decimalSeparator: ".", thousandSeparator: "," },
  { name: "Germany", currency: "EUR", decimalSeparator: ",", thousandSeparator: "." },
  { name: "Nigeria", currency: "NGN", decimalSeparator: ".", thousandSeparator: "," },
  { name: "Japan", currency: "JPY", decimalSeparator: ".", thousandSeparator: "," },
  { name: "China", currency: "CNY", decimalSeparator: ".", thousandSeparator: "," },
  { name: "Australia", currency: "AUD", decimalSeparator: ".", thousandSeparator: "," },
  { name: "Canada", currency: "CAD", decimalSeparator: ".", thousandSeparator: "," },
  { name: "Switzerland", currency: "CHF", decimalSeparator: ".", thousandSeparator: "," },
  { name: "Hong Kong", currency: "HKD", decimalSeparator: ".", thousandSeparator: "," },
  { name: "Singapore", currency: "SGD", decimalSeparator: ".", thousandSeparator: "," },
  { name: "South Korea", currency: "KRW", decimalSeparator: ".", thousandSeparator: "," },
  { name: "Sweden", currency: "SEK", decimalSeparator: ",", thousandSeparator: " " },
  { name: "Norway", currency: "NOK", decimalSeparator: ",", thousandSeparator: " " },
  { name: "New Zealand", currency: "NZD", decimalSeparator: ".", thousandSeparator: "," },
  { name: "India", currency: "INR", decimalSeparator: ".", thousandSeparator: "," },
  { name: "United Arab Emirates", currency: "AED", decimalSeparator: ".", thousandSeparator: "," },
  { name: "Saudi Arabia", currency: "SAR", decimalSeparator: ".", thousandSeparator: "," },
  { name: "Poland", currency: "PLN", decimalSeparator: ",", thousandSeparator: " " },
  { name: "Czech Republic", currency: "CZK", decimalSeparator: ",", thousandSeparator: " " },
];

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "KRW", name: "South Korean Won" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "NZD", name: "New Zealand Dollar" },
];

// exchangeRates are to be updated dynamically, using an API that either checks the exchange rate every 10mn, 60mn, 1h etc.
const exchangeRates = {
  USD: 1,
  GBP: 1.3,
  EUR: 1.1,
  NGN: 950,
  JPY: 110,
  CNY: 6.5,
  AUD: 1.35,
  CAD: 1.25,
  CHF: 0.92,
  HKD: 7.8,
  SGD: 1.35,
  SEK: 8.5,
  KRW: 1150,
  NOK: 8.7,
  NZD: 1.4,
  INR: 75,
  AED: 3.67,
  SAR: 3.75,
  PLN: 3.9,
  CZK: 21.5,
};

const forexMarkup = 0.0025;

const jobs = [
  "Software Engineer",
  "Data Scientist",
  "UX/UI Designer",
  "DevOps Engineer",
  "Product Manager",
  "Accountant",
  "Financial Analyst",
  "Investment Banker",
  "Auditor",
  "Social Media Manager",
  "Content Marketer",
  "SEO Specialist",
  "Marketing Analyst",
  "Sales Manager",
  "Account Manager",
  "Business Development Manager",
  "Customer Support",
  "Technical Support",
  "Virtual Assistant",
];

const paymentMethods = [
  { method: "Debit Card", icon: <CreditCardIcon /> },
  { method: "Bank Transfer", icon: <BankIcon /> },
  { method: "Bitcoin", icon: <BitcoinIcon /> },
];

const CostCalculator = () => {
  const [country, setCountry] = useState(null);
  const [currency, setCurrency] = useState("");
  const [startDate, setStartDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [paymentRate, setPaymentRate] = useState("");
  const [deposit, setDeposit] = useState(0);
  const [employeeType, setEmployeeType] = useState("Permanent");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentFrequency, setPaymentFrequency] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [error, setError] = useState("");
  const [contractType, setContractType] = useState("global");
  const [customContractFile, setCustomContractFile] = useState(null);

  useEffect(() => {
    if (paymentRate > 999999) {
      setError("Please input an amount below 999,999.");
      setDeposit(0);
    } else {
      setError("");
      const noticePeriodMonths = 2;
      let baseDeposit;

      switch (paymentFrequency) {
        case "Weekly":
          baseDeposit = paymentRate * 8;
          break;
        case "Biweekly":
          baseDeposit = paymentRate * 4;
          break;
        case "Monthly":
          baseDeposit = paymentRate * 2;
          break;
        default:
          baseDeposit = paymentRate * 2;
      }

      const depositWithMarkup = baseDeposit + baseDeposit * forexMarkup;
      setDeposit(depositWithMarkup);
    }
  }, [paymentRate, paymentFrequency]);

  const handleCountryChange = (event, value) => {
    setCountry(value);
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleEmployeeTypeChange = (event) => {
    setEmployeeType(event.target.value);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handlePaymentFrequencyChange = (event) => {
    setPaymentFrequency(event.target.value);
  };

  const handleJobSearchChange = (event, value) => {
    setJobSearch(value);
  };

  const handleJobSelect = (event, value) => {
    setSelectedJob(value);
  };

  const handleContractTypeChange = (type) => {
    setContractType(type);
    setCustomContractFile(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setCustomContractFile(file);
  };

  const formatNumber = (value) => {
    if (!country) return value;
    const { decimalSeparator, thousandSeparator } = country;
    return value
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
      .replace(".", decimalSeparator);
  };

  const handlePaymentRateChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setPaymentRate(value);
  };

  const calculateWorkingDays = (start, end) => {
    let count = 0;
    const current = new Date(start);
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  const workingDays = employeeType === "Contractor" ? calculateWorkingDays(startDate, endDate) : 0;

  const filteredJobs = jobs.filter((job) =>
    job.toLowerCase().includes(jobSearch.toLowerCase())
  );

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#222E64" p={4}>
      <Card sx={{ p: 4, width: "100%", maxWidth: 600, bgcolor: "#f5f5f5", borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
            Employment Cost Calculator
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" mb={4}>
            Hire global talent anywhere, anytime.
          </Typography>

          <Box mb={2}>
            <Autocomplete
              value={country}
              onChange={handleCountryChange}
              options={countries}
              getOptionLabel={(option) => option?.name || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={!country ? "Start typing the name of the country you want to hire from" : ""}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#222E64",
                      },
                      "&:hover fieldset": {
                        borderColor: "#222E64",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#222E64",
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          <Box mb={2}>
            <Autocomplete
              value={selectedJob}
              onChange={handleJobSelect}
              inputValue={jobSearch}
              onInputChange={handleJobSearchChange}
              options={filteredJobs}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Type the role"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#222E64",
                      },
                      "&:hover fieldset": {
                        borderColor: "#222E64",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#222E64",
                      },
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option}
                </Box>
              )}
              noOptionsText="No matching roles found"
            />
          </Box>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={currency}
                  onChange={handleCurrencyChange}
                  label="Currency"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#222E64",
                      },
                      "&:hover fieldset": {
                        borderColor: "#222E64",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#222E64",
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Currency
                  </MenuItem>
                  {currencies.map((cur) => (
                    <MenuItem key={cur.code} value={cur.code}>{`${cur.code} - ${cur.name}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8}>
              <TextField
                label="Payment rate"
                value={formatNumber(paymentRate)}
                onChange={handlePaymentRateChange}
                fullWidth
                inputProps={{ max: 999999 }}
                error={!!error}
                helperText={error}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#222E64",
                    },
                    "&:hover fieldset": {
                      borderColor: "#222E64",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#222E64",
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box mb={2}>
            <FormControl fullWidth>
              <InputLabel>Payment Frequency</InputLabel>
              <Select
                value={paymentFrequency}
                onChange={handlePaymentFrequencyChange}
                label="Payment Frequency"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#222E64",
                    },
                    "&:hover fieldset": {
                      borderColor: "#222E64",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#222E64",
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Payment Frequency
                </MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Biweekly">Biweekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box mb={2}>
            <Typography fontWeight="Bold">Employee Type:</Typography>
            <RadioGroup row value={employeeType} onChange={handleEmployeeTypeChange}>
              <FormControlLabel value="Permanent" control={<Radio />} label="Permanent" />
              <FormControlLabel value="Contractor" control={<Radio />} label="Contractor" />
            </RadioGroup>
          </Box>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <Typography fontWeight="medium">Select Start Date:</Typography>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                customInput={
                  <TextField
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={(e) => e.preventDefault()}>
                            <CalendarTodayIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "& fieldset": {
                          borderColor: "#222E64",
                        },
                        "&:hover fieldset": {
                          borderColor: "#222E64",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#222E64",
                        },
                      },
                    }}
                  />
                }
              />
            </Grid>
            {employeeType === "Contractor" && (
              <Grid item xs={6}>
                <Typography fontWeight="medium">Select End Date:</Typography>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  minDate={startDate}
                  customInput={
                    <TextField
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={(e) => e.preventDefault()}>
                              <CalendarTodayIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                        readOnly: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          "& fieldset": {
                            borderColor: "#222E64",
                          },
                          "&:hover fieldset": {
                            borderColor: "#222E64",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#222E64",
                          },
                        },
                      }}
                    />
                  }
                />
              </Grid>
            )}
          </Grid>

          <Box mb={3} p={2} bgcolor="#e0e0e0" borderRadius={1}>
            <Typography fontWeight="bold">
              Calculated Amount: <strong>{formatNumber(deposit.toFixed(2))} {currency}</strong>
            </Typography>
            {currency && paymentRate && (
              <Typography color="textSecondary" mt={1}>
                Exchange Rate: 1 {currency} = {formatNumber((exchangeRates[country?.currency] * (1 + forexMarkup)).toFixed(4))}{" "}
                {country?.currency}
              </Typography>
            )}
            {employeeType === "Contractor" && (
              <Grid container spacing={2} mt={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    {workingDays} working days
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary" align="right">
                    Period: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            )}
            <Box display="flex" alignItems="center" mt={1}>
              <Typography variant="body2" color="textSecondary">
                What's included in the cost?
              </Typography>
              <Tooltip
                title="The final cost includes admin fees, the deposit, onboarding fees, extra operational costs such as severance packages and covers the resignation period."
                arrow
              >
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box mb={2}>
            <Typography fontWeight="Bold">Contract compliance</Typography>
            <br />
            <Typography fontWeight="subtitle2">
              Do you want to use our own locally compliant contract? You can choose to upload your own contract that has already been signed.
            </Typography>
            <br />
            <Box display="flex" justifyContent="space-between" sx={{ borderRadius: "8px", p: 1 }}>
              <Button
                variant={contractType === "global" ? "contained" : "outlined"}
                onClick={() => handleContractTypeChange("global")}
                disableRipple
                sx={{
                  flex: 1,
                  borderRadius: "6px",
                  bgcolor: contractType === "global" ? "#222E64" : "transparent",
                  color: contractType === "global" ? "#fff" : "#222E64",
                  "&:hover": {
                    bgcolor: contractType === "global" ? "#222E64" : "transparent",
                  },
                }}
              >
                Use Our Locally Compliant Contract
              </Button>
              <Button
                variant={contractType === "custom" ? "contained" : "outlined"}
                onClick={() => handleContractTypeChange("custom")}
                disableRipple
                sx={{
                  flex: 1,
                  borderRadius: "6px",
                  bgcolor: contractType === "custom" ? "#222E64" : "transparent",
                  color: contractType === "custom" ? "#fff" : "#222E64",
                  "&:hover": {
                    bgcolor: contractType === "custom" ? "#222E64" : "transparent",
                  },
                }}
              >
                Use my own contract
              </Button>
            </Box>
            {contractType === "custom" && (
              <Box mt={2}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  id="contract-upload"
                />
                <label htmlFor="contract-upload">
                  <Button variant="outlined" component="span" fullWidth disableRipple>
                    Upload Contract
                  </Button>
                </label>
                {customContractFile && (
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    Uploaded: {customContractFile.name}
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          <Box mb={2}>
            <Typography fontWeight="Bold">Select Payment Method:</Typography>
            <FormControl component="fieldset" fullWidth disableRipple>
              <RadioGroup
                value={paymentMethod}
                onChange={(event) => handlePaymentMethodChange(event.target.value)}
                sx={{ textAlign: "left" }}
              >
                {paymentMethods.map(({ method, icon }) => (
                  <FormControlLabel
                    key={method}
                    value={method}
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center">
                        <Box mr={1}>{icon}</Box>
                        <Typography>{method}</Typography>
                      </Box>
                    }
                    sx={{ ml: 0 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>

          <Button variant="contained" color="primary" fullWidth size="large" disableRipple>
            Get a deposit invoice
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CostCalculator;