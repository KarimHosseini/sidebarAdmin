import React, { useState, useCallback } from "react";
import { 
  Box, 
  Typography, 
  Slider, 
  TextField, 
  ToggleButton, 
  ToggleButtonGroup,
  Button,
  IconButton,
  Tooltip,
  Paper,
  Tabs,
  Tab,
  InputAdornment,
  Alert
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import CodeIcon from "@mui/icons-material/Code";
import PaletteIcon from "@mui/icons-material/Palette";

// Color stop component for gradient
const ColorStop = ({ index, color, onChange, onDelete, totalStops }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
      <Tooltip title="انتخاب رنگ">
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: color.color,
            border: "2px solid #ccc",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <input
            type="color"
            value={color.color}
            onChange={(e) => onChange(index, { ...color, color: e.target.value })}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "150%",
              height: "150%",
              transform: "translate(-25%, -25%)",
              cursor: "pointer",
              opacity: 0,
            }}
          />
        </Box>
      </Tooltip>
      
      <Slider
        value={color.position}
        min={0}
        max={100}
        step={1}
        onChange={(_, value) => onChange(index, { ...color, position: value })}
        sx={{ width: 150, direction: "ltr" }}
      />
      
      <Typography sx={{ minWidth: 40, textAlign: "center" }}>
        {color.position}%
      </Typography>
      
      {totalStops > 2 && (
        <Tooltip title="حذف نقطه رنگ">
          <IconButton size="small" onClick={() => onDelete(index)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

// Gradient preview component
const GradientPreview = ({ stops, direction, gradientType }) => {
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  
  let gradient;
  if (gradientType === "linear") {
    gradient = `linear-gradient(${direction}, ${sortedStops
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ")})`;
  } else {
    gradient = `radial-gradient(circle, ${sortedStops
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ")})`;
  }

  return (
    <Box
      sx={{
        height: 120,
        background: gradient,
        borderRadius: 2,
        mt: 2,
        border: "1px solid #ccc",
        boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
      }}
    />
  );
};

// Main color picker component with simplified props
const ColorInput = ({ color, setColor, name, changeName }) => {
  // Initialize state based on props or defaults
  const [colorMode, setColorMode] = useState(() => {
    // Detect if the color is a gradient, solid color, or custom CSS
    if (!color) return "solid";
    if (typeof color === "string") {
      if (color.includes("gradient")) return "gradient";
      if (color.startsWith("#") || color.startsWith("rgb") || color.startsWith("hsl")) return "solid";
      return "custom";
    }
    return "solid";
  });
  
  // Parse initial color value
  const parseInitialValue = () => {
    if (!color) return { 
      solidColor: "#3f51b5",
      gradientType: "linear",
      direction: "to right",
      stops: [
        { color: "#ff5252", position: 0 },
        { color: "#2196f3", position: 100 },
      ],
      customCss: ""
    };
    
    if (typeof color === "string") {
      if (color.startsWith("#") || color.startsWith("rgb") || color.startsWith("hsl")) {
        return {
          solidColor: color,
          gradientType: "linear",
          direction: "to right",
          stops: [
            { color: "#ff5252", position: 0 },
            { color: "#2196f3", position: 100 },
          ],
          customCss: ""
        };
      }
      
      if (color.includes("linear-gradient")) {
        try {
          // Very basic parsing of linear gradient
          const direction = color.match(/linear-gradient\(([^,]+)/)?.[1] || "to right";
          return {
            solidColor: "#3f51b5",
            gradientType: "linear",
            direction: direction,
            stops: [
              { color: "#ff5252", position: 0 },
              { color: "#2196f3", position: 100 },
            ],
            customCss: color
          };
        } catch (e) {
          // Fallback if parsing fails
          return {
            solidColor: "#3f51b5",
            gradientType: "linear",
            direction: "to right",
            stops: [
              { color: "#ff5252", position: 0 },
              { color: "#2196f3", position: 100 },
            ],
            customCss: color
          };
        }
      }
      
      if (color.includes("radial-gradient")) {
        return {
          solidColor: "#3f51b5",
          gradientType: "radial",
          direction: "to right",
          stops: [
            { color: "#ff5252", position: 0 },
            { color: "#2196f3", position: 100 },
          ],
          customCss: color
        };
      }
      
      return {
        solidColor: "#3f51b5",
        gradientType: "linear",
        direction: "to right",
        stops: [
          { color: "#ff5252", position: 0 },
          { color: "#2196f3", position: 100 },
        ],
        customCss: color
      };
    }
    
    return {
      solidColor: "#3f51b5",
      gradientType: "linear",
      direction: "to right",
      stops: [
        { color: "#ff5252", position: 0 },
        { color: "#2196f3", position: 100 },
      ],
      customCss: ""
    };
  };
  
  const initialValue = parseInitialValue();
  
  const [solidColor, setSolidColor] = useState(initialValue.solidColor);
  const [gradientType, setGradientType] = useState(initialValue.gradientType);
  const [direction, setDirection] = useState(initialValue.direction);
  const [colorStops, setColorStops] = useState(initialValue.stops);
  const [customCssCode, setCustomCssCode] = useState(initialValue.customCss);
  const [cssCodeError, setCssCodeError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Handle updating a color stop
  const updateStop = useCallback((index, newStop) => {
    const newStops = [...colorStops];
    newStops[index] = newStop;
    setColorStops(newStops);
    
    if (setColor) {
      const sortedStops = [...newStops].sort((a, b) => a.position - b.position);
      if (gradientType === "linear") {
        setColor(`linear-gradient(${direction}, ${sortedStops
          .map((s) => `${s.color} ${s.position}%`)
          .join(", ")})`);
      } else {
        setColor(`radial-gradient(circle, ${sortedStops
          .map((s) => `${s.color} ${s.position}%`)
          .join(", ")})`);
      }
    }
  }, [colorStops, direction, gradientType, setColor]);

  // Add a new color stop
  const addColorStop = useCallback(() => {
    // Find middle position between existing stops
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    let newPosition = 50;
    
    if (sortedStops.length >= 2) {
      // Find the largest gap between stops
      let maxGap = 0;
      let gapPosition = 50;
      
      for (let i = 0; i < sortedStops.length - 1; i++) {
        const gap = sortedStops[i + 1].position - sortedStops[i].position;
        if (gap > maxGap) {
          maxGap = gap;
          gapPosition = sortedStops[i].position + gap / 2;
        }
      }
      
      newPosition = Math.round(gapPosition);
    }
    
    // Mix colors of adjacent stops for new color
    let newColor = "#7B68EE"; // Default color
    if (sortedStops.length >= 2) {
      // Find stops that surround the new position
      for (let i = 0; i < sortedStops.length - 1; i++) {
        if (sortedStops[i].position <= newPosition && sortedStops[i + 1].position >= newPosition) {
          // Simple color mixing - in a real app you'd want a better algorithm
          newColor = sortedStops[i].color;
          break;
        }
      }
    }
    
    const newStops = [...colorStops, { color: newColor, position: newPosition }];
    setColorStops(newStops);
    
    if (setColor) {
      const sortedStops = [...newStops].sort((a, b) => a.position - b.position);
      if (gradientType === "linear") {
        setColor(`linear-gradient(${direction}, ${sortedStops
          .map((s) => `${s.color} ${s.position}%`)
          .join(", ")})`);
      } else {
        setColor(`radial-gradient(circle, ${sortedStops
          .map((s) => `${s.color} ${s.position}%`)
          .join(", ")})`);
      }
    }
  }, [colorStops, direction, gradientType, setColor]);

  // Delete a color stop
  const deleteColorStop = useCallback((index) => {
    if (colorStops.length <= 2) return; // Maintain at least 2 stops
    
    const newStops = colorStops.filter((_, i) => i !== index);
    setColorStops(newStops);
    
    if (setColor) {
      const sortedStops = [...newStops].sort((a, b) => a.position - b.position);
      if (gradientType === "linear") {
        setColor(`linear-gradient(${direction}, ${sortedStops
          .map((s) => `${s.color} ${s.position}%`)
          .join(", ")})`);
      } else {
        setColor(`radial-gradient(circle, ${sortedStops
          .map((s) => `${s.color} ${s.position}%`)
          .join(", ")})`);
      }
    }
  }, [colorStops, direction, gradientType, setColor]);

  // Handle direction change
  const handleDirectionChange = useCallback((_, val) => {
    if (val) {
      setDirection(val);
      
      if (setColor) {
        const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
        setColor(`linear-gradient(${val}, ${sortedStops
          .map((s) => `${s.color} ${s.position}%`)
          .join(", ")})`);
      }
    }
  }, [colorStops, setColor]);

  // Handle gradient type change
  const handleGradientTypeChange = useCallback((_, val) => {
    if (val) {
      setGradientType(val);
      
      if (setColor) {
        const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
        if (val === "linear") {
          setColor(`linear-gradient(${direction}, ${sortedStops
            .map((s) => `${s.color} ${s.position}%`)
            .join(", ")})`);
        } else {
          setColor(`radial-gradient(circle, ${sortedStops
            .map((s) => `${s.color} ${s.position}%`)
            .join(", ")})`);
        }
      }
    }
  }, [colorStops, direction, setColor]);

  // Handle name change
  const handleNameChange = useCallback((e) => {
    if (changeName) {
      changeName(e.target.value);
    }
  }, [changeName]);

  // Handle color mode change
  const handleColorModeChange = useCallback((_, val) => {
    if (val) {
      setColorMode(val);
      
      if (setColor) {
        if (val === "solid") {
          setColor(solidColor);
        } else if (val === "gradient") {
          const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
          if (gradientType === "linear") {
            setColor(`linear-gradient(${direction}, ${sortedStops
              .map((s) => `${s.color} ${s.position}%`)
              .join(", ")})`);
          } else {
            setColor(`radial-gradient(circle, ${sortedStops
              .map((s) => `${s.color} ${s.position}%`)
              .join(", ")})`);
          }
        } else if (val === "custom") {
          setColor(customCssCode);
        }
      }
    }
  }, [colorStops, direction, gradientType, setColor, solidColor, customCssCode]);

  // Handle solid color change
  const handleSolidColorChange = useCallback((e) => {
    setSolidColor(e.target.value);
    
    if (setColor && colorMode === "solid") {
      setColor(e.target.value);
    }
  }, [colorMode, setColor]);

  // Handle custom CSS code change
  const handleCustomCssChange = useCallback((e) => {
    const cssCode = e.target.value;
    setCustomCssCode(cssCode);
    
    // Basic validation for CSS code
    const isValidCss = /^(background(-color)?|color)?\s*:\s*(#|rgb|rgba|hsl|hsla|linear-gradient|radial-gradient|repeating-linear-gradient|repeating-radial-gradient|var\(|inherit|initial|unset)/.test(cssCode);
    
    setCssCodeError(cssCode && !isValidCss ? "کد CSS وارد شده معتبر نیست" : null);
    
    if (setColor && colorMode === "custom" && (!cssCode || isValidCss)) {
      setColor(cssCode);
    }
  }, [colorMode, setColor]);

  // Generate CSS code based on current mode
  const generateCssCode = useCallback(() => {
    if (colorMode === "solid") {
      return `background-color: ${solidColor};`;
    } else if (colorMode === "custom") {
      return customCssCode || "/* کد CSS خود را وارد کنید */";
    } else {
      const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
      
      if (gradientType === "linear") {
        return `background: linear-gradient(${direction}, ${sortedStops
          .map((s) => `${s.color} ${s.position}%`)
          .join(", ")});`;
      } else {
        return `background: radial-gradient(circle, ${sortedStops
          .map((s) => `${s.color} ${s.position}%`)
          .join(", ")});`;
      }
    }
  }, [colorMode, colorStops, direction, gradientType, solidColor, customCssCode]);

  // Preview style based on current mode
  const getPreviewStyle = useCallback(() => {
    if (colorMode === "solid") {
      return { background: solidColor };
    } else if (colorMode === "custom") {
      try {
        // Extract the value part from CSS property
        const cssValue = customCssCode.replace(/^[^:]+:\s*/, '').replace(/;$/, '').trim();
        return { background: cssValue };
      } catch (e) {
        return { background: "#f5f5f5" };
      }
    } else {
      const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
      
      if (gradientType === "linear") {
        return { 
          background: `linear-gradient(${direction}, ${sortedStops
            .map((s) => `${s.color} ${s.position}%`)
            .join(", ")})` 
        };
      } else {
        return { 
          background: `radial-gradient(circle, ${sortedStops
            .map((s) => `${s.color} ${s.position}%`)
            .join(", ")})` 
        };
      }
    }
  }, [colorMode, colorStops, direction, gradientType, solidColor, customCssCode]);

  // Copy CSS code to clipboard
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(generateCssCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generateCssCode]);

  return (
    <Paper elevation={3} sx={{ direction: "rtl", fontFamily: "Vazirmatn, sans-serif", p: 3, maxWidth: 500, mx: "auto", borderRadius: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
        انتخاب رنگ
      </Typography>
      
      <ToggleButtonGroup
        value={colorMode}
        exclusive
        onChange={handleColorModeChange}
        sx={{ mb: 3, width: "100%" }}
        size="small"
      >
        <ToggleButton value="solid" sx={{ flex: 1 }}>
          <ColorLensIcon sx={{ ml: 1 }} />
          رنگ ساده
        </ToggleButton>
        <ToggleButton value="gradient" sx={{ flex: 1 }}>
          <PaletteIcon sx={{ ml: 1 }} />
          گرادینت
        </ToggleButton>
        <ToggleButton value="custom" sx={{ flex: 1 }}>
          <CodeIcon sx={{ ml: 1 }} />
          کد CSS
        </ToggleButton>
      </ToggleButtonGroup>
      
      {colorMode === "solid" && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
            انتخاب رنگ ساده
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "8px",
                background: solidColor,
                border: "2px solid #ccc",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <input
                type="color"
                value={solidColor}
                onChange={handleSolidColorChange}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "150%",
                  height: "150%",
                  transform: "translate(-25%, -25%)",
                  cursor: "pointer",
                  opacity: 0,
                }}
              />
            </Box>
            
            <TextField
              label="کد رنگ"
              variant="outlined"
              size="small"
              value={solidColor}
              onChange={handleSolidColorChange}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: <InputAdornment position="start">#</InputAdornment>,
              }}
            />
          </Box>
          
          <TextField
            label="نام رنگ"
            variant="outlined"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={name || ""}
            onChange={handleNameChange}
          />
          
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
            پیش‌نمایش
          </Typography>
          <Box
            sx={{
              height: 120,
              background: solidColor,
              borderRadius: 2,
              border: "1px solid #ccc",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
            }}
          />
        </Box>
      )}
      
      {colorMode === "custom" && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
            کد CSS سفارشی
          </Typography>
          
          <TextField
            label="کد CSS"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            placeholder="background: linear-gradient(to right, #ff5252, #2196f3);"
            value={customCssCode}
            onChange={handleCustomCssChange}
            error={!!cssCodeError}
            helperText={cssCodeError}
            sx={{ mb: 2, fontFamily: "monospace", direction: "ltr" }}
          />
          
          <TextField
            label="نام رنگ"
            variant="outlined"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={name || ""}
            onChange={handleNameChange}
          />
          
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
            پیش‌نمایش
          </Typography>
          <Box
            sx={{
              height: 120,
              ...getPreviewStyle(),
              borderRadius: 2,
              border: "1px solid #ccc",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
            }}
          />
        </Box>
      )}
      
      {colorMode === "gradient" && (
        <>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            centered
            sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="تنظیمات گرادینت" />
            <Tab label="کد CSS" />
          </Tabs>
          
          {activeTab === 0 && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
                  نوع گرادینت
                </Typography>
                <ToggleButtonGroup
                  value={gradientType}
                  exclusive
                  onChange={handleGradientTypeChange}
                  sx={{ mb: 2, width: "100%" }}
                  size="small"
                >
                  <ToggleButton value="linear" sx={{ flex: 1 }}>
                    <LinearScaleIcon sx={{ ml: 1 }} />
                    خطی
                  </ToggleButton>
                  <ToggleButton value="radial" sx={{ flex: 1 }}>
                    <RadioButtonUncheckedIcon sx={{ ml: 1 }} />
                    شعاعی
                  </ToggleButton>
                </ToggleButtonGroup>
                
                {gradientType === "linear" && (
                  <>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
                      جهت گرادینت
                    </Typography>
                    <ToggleButtonGroup
                      value={direction}
                      exclusive
                      onChange={handleDirectionChange}
                      sx={{ width: "100%" }}
                      size="small"
                    >
                      <ToggleButton value="to right" sx={{ flex: 1 }}>چپ به راست</ToggleButton>
                      <ToggleButton value="to left" sx={{ flex: 1 }}>راست به چپ</ToggleButton>
                    </ToggleButtonGroup>
                    <ToggleButtonGroup
                      value={direction}
                      exclusive
                      onChange={handleDirectionChange}
                      sx={{ width: "100%", mt: 1 }}
                      size="small"
                    >
                      <ToggleButton value="to bottom" sx={{ flex: 1 }}>بالا به پایین</ToggleButton>
                      <ToggleButton value="to top" sx={{ flex: 1 }}>پایین به بالا</ToggleButton>
                    </ToggleButtonGroup>
                    <ToggleButtonGroup
                      value={direction}
                      exclusive
                      onChange={handleDirectionChange}
                      sx={{ width: "100%", mt: 1 }}
                      size="small"
                    >
                      <ToggleButton value="to bottom right" sx={{ flex: 1 }}>بالا چپ به پایین راست</ToggleButton>
                      <ToggleButton value="to bottom left" sx={{ flex: 1 }}>بالا راست به پایین چپ</ToggleButton>
                    </ToggleButtonGroup>
                  </>
                )}
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                    نقاط رنگ
                  </Typography>
                  <Tooltip title="افزودن نقطه رنگ">
                    <IconButton size="small" onClick={addColorStop} color="primary">
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Box sx={{ maxHeight: 200, overflowY: "auto", pr: 1 }}>
                  {colorStops.map((stop, i) => (
                    <ColorStop 
                      key={i} 
                      index={i} 
                      color={stop} 
                      onChange={updateStop} 
                      onDelete={deleteColorStop}
                      totalStops={colorStops.length}
                    />
                  ))}
                </Box>
              </Box>
              
              <TextField
                label="نام گرادینت"
                variant="outlined"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={name || ""}
                onChange={handleNameChange}
              />
              
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
                پیش‌نمایش
              </Typography>
              <GradientPreview stops={colorStops} direction={direction} gradientType={gradientType} />
            </>
          )}
          
          {activeTab === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
                کد CSS
              </Typography>
              
              <Box 
                sx={{ 
                  p: 2, 
                  borderRadius: 1, 
                  bgcolor: "#f5f5f5", 
                  fontFamily: "monospace",
                  direction: "ltr",
                  position: "relative",
                  mb: 2,
                  overflow: "auto",
                  maxHeight: 300
                }}
              >
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{generateCssCode()}</pre>
                
                <Tooltip title={copied ? "کپی شد!" : "کپی کد"}>
                  <IconButton 
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={copyToClipboard}
                    color={copied ? "success" : "default"}
                  >
                    {copied ? <CheckIcon /> : <ContentCopyIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
                پیش‌نمایش
              </Typography>
              <GradientPreview stops={colorStops} direction={direction} gradientType={gradientType} />
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default ColorInput;
