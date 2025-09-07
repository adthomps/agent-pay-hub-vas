import { Monitor, Zap, TestTube, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useModeToggle } from "@/hooks/useModeToggle";

export function ModeToggle() {
  const { currentMode, canGoLive, toggleMode, loading } = useModeToggle();

  const handleModeChange = (mode: 'demo' | 'live') => {
    toggleMode(mode);
  };

  const getModeIcon = () => {
    if (currentMode === 'live') {
      return <Zap className="h-4 w-4 text-green-500" />;
    }
    return <TestTube className="h-4 w-4 text-orange-500" />;
  };

  const getModeLabel = () => {
    return currentMode === 'live' ? 'Live' : 'Demo';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-2 min-w-[80px]"
          disabled={loading}
        >
          {getModeIcon()}
          <span className="text-xs font-medium">{getModeLabel()}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={() => handleModeChange("demo")}
          className="cursor-pointer"
        >
          <TestTube className="mr-2 h-4 w-4 text-orange-500" />
          <div className="flex-1">
            <div className="font-medium">Demo Mode</div>
            <div className="text-xs text-muted-foreground">Mock responses</div>
          </div>
          {currentMode === 'demo' && <Monitor className="h-3 w-3 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleModeChange("live")}
          disabled={!canGoLive}
          className={`cursor-pointer ${!canGoLive ? 'opacity-50' : ''}`}
        >
          <Zap className="mr-2 h-4 w-4 text-green-500" />
          <div className="flex-1">
            <div className="font-medium">Live Mode</div>
            <div className="text-xs text-muted-foreground">
              {canGoLive ? 'Real API calls' : 'Credentials required'}
            </div>
          </div>
          {currentMode === 'live' && <Monitor className="h-3 w-3 ml-2" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}