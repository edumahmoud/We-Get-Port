"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Calculator, Wifi, Server, Download } from "lucide-react";

const BG_COLORS = [
  "from-purple-600 to-indigo-800",
  "from-emerald-500 to-teal-700",
  "from-rose-500 to-pink-700",
  "from-amber-500 to-orange-700",
  "from-cyan-500 to-blue-700",
  "from-violet-500 to-purple-700",
];

interface PortResult {
  row: number;
  col: number;
}

export default function Home() {
  const [frameNumber, setFrameNumber] = useState<string>("");
  const [cabinetType, setCabinetType] = useState<string>("");
  const [result, setResult] = useState<PortResult | null>(null);
  const [error, setError] = useState<string>("");
  const bgGradient = useMemo(() => BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)], []);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        console.log("Service Worker registered:", reg.scope);
      }).catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
    }

    // Handle install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const calculatePort = useCallback(() => {
    const total = parseInt(frameNumber);

    if (!total || isNaN(total)) {
      setError("يرجى إدخال رقم الفريم!");
      setResult(null);
      return;
    }

    if (!cabinetType) {
      setError("يرجى اختيار نوع الكابينة!");
      setResult(null);
      return;
    }

    const totalRes = total / 16;
    const row = Math.floor(totalRes) + 1;
    const port = totalRes - Math.floor(totalRes);

    const cols: number[] = [];
    for (let x = 1; x <= 16; x++) {
      cols.push(x / 16);
    }

    const col = cols.indexOf(port) + 1;

    let colResult: number, rowResult: number;

    if (cabinetType === "h") {
      if (col === 0) {
        colResult = 15;
        rowResult = row - 1;
      } else {
        colResult = col - 1;
        rowResult = row;
      }
    } else if (cabinetType === "o") {
      if (col === 0) {
        colResult = 16;
        rowResult = row - 1;
      } else {
        colResult = col;
        rowResult = row;
      }
    } else {
      setError("يرجى اختيار نوع الكابينة الصحيح!");
      setResult(null);
      return;
    }

    setResult({ row: rowResult, col: colResult });
    setError("");
  }, [frameNumber, cabinetType]);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgGradient} flex flex-col items-center justify-center p-4 transition-colors duration-1000`}
      suppressHydrationWarning
    >
      {/* Install PWA Button */}
      {showInstall && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <Button
            onClick={handleInstall}
            className="bg-white text-purple-700 hover:bg-gray-100 shadow-lg gap-2 font-bold"
          >
            <Download className="h-5 w-5" />
            تثبيت التطبيق
          </Button>
        </div>
      )}

      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden relative">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-red-500/20 rounded-full blur-xl" />

        <CardHeader className="text-center pb-2 relative z-10">
          <div className="mx-auto mb-3 w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            حاسبة البورتات
          </CardTitle>
          <CardDescription className="text-muted-foreground flex items-center justify-center gap-2">
            <Wifi className="h-4 w-4" />
            WeGet - Port
            <Server className="h-4 w-4" />
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 relative z-10">
          {/* Frame Number Input */}
          <div className="space-y-2">
            <Label htmlFor="frame-number" className="text-right font-semibold block">
              أدخل رقم الفريم
            </Label>
            <Input
              id="frame-number"
              type="number"
              placeholder="رقم الفريم"
              value={frameNumber}
              onChange={(e) => setFrameNumber(e.target.value)}
              className="text-center text-lg h-12 border-2 focus:border-purple-500 transition-colors"
              dir="ltr"
            />
          </div>

          {/* Cabinet Type Select */}
          <div className="space-y-2">
            <Label className="text-right font-semibold block">اختر نوع الكابينة</Label>
            <Select value={cabinetType} onValueChange={setCabinetType}>
              <SelectTrigger className="h-12 text-center border-2 focus:border-purple-500 transition-colors">
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                    Huawei
                  </span>
                </SelectItem>
                <SelectItem value="o">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                    ZTE / Nokia
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Calculate Button */}
          <Button
            onClick={calculatePort}
            className="w-full h-12 text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calculator className="h-5 w-5 mr-2" />
            حساب
          </Button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-center text-red-600 font-semibold animate-in fade-in duration-300">
              {error}
            </div>
          )}

          {/* Result Table */}
          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Table className="border-2 border-purple-200 rounded-lg overflow-hidden">
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-600">
                    <TableHead className="text-white text-center font-bold text-base">
                      الصف
                    </TableHead>
                    <TableHead className="text-white text-center font-bold text-base">
                      العمود
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-purple-50 hover:bg-purple-100">
                    <TableCell className="text-center text-2xl font-bold text-purple-700 py-4">
                      {result.row}
                    </TableCell>
                    <TableCell className="text-center text-2xl font-bold text-indigo-700 py-4">
                      {result.col}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground pt-4 border-t">
            Created with ❤️ by{" "}
            <a
              href="https://www.facebook.com/m.helaly0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 font-semibold underline underline-offset-2"
            >
              Tech - Mahmoud Ramadan
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Type for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
