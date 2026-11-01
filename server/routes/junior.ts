import { Router, Response, Request } from 'express';
import { badgeStore } from '../models/Badge.ts';

export const juniorRouter = Router();

// Preset Devashtra Junior Missions
export const JUNIOR_MISSIONS = [
  {
    id: 'mission-1',
    title: 'Mission 1: The Mars Rover Awakening',
    story: 'Your rover has touched down in Jezero Crater, but the battery sensor sends a scrambled number! Use Python to calculate remaining battery power.',
    starterCode: `# Help Rover compute remaining battery percentage
total_units = 500
used_units = 185

# Calculate remaining percentage
remaining_pct = ((total_units - used_units) / total_units) * 100
print(f"Mars Rover Battery: {remaining_pct:.1f}%")
`,
    expectedOutput: 'Mars Rover Battery: 63.0%',
    xpReward: 100,
    badgeId: 'badge-junior-space-coder',
  },
  {
    id: 'mission-2',
    title: 'Mission 2: Cyber Shield Cipher',
    story: 'Alien communications detected! Protect the space station network by creating a strong passcode validator.',
    starterCode: `# Check if password is secure (at least 8 characters and has a number)
def is_cyber_safe(password):
    has_min_len = len(password) >= 8
    has_digit = any(char.isdigit() for char in password)
    return has_min_len and has_digit

test_code = "CosmicRover99"
print("Passcode Safe:", is_cyber_safe(test_code))
`,
    expectedOutput: 'Passcode Safe: True',
    xpReward: 150,
    badgeId: 'badge-cipher-master',
  },
  {
    id: 'mission-3',
    title: 'Mission 3: Asteroid Field Navigation Loop',
    story: 'Navigate through a dense asteroid belt by coding a safe distance scanning loop.',
    starterCode: `# Scan ahead 5 kilometers
for distance in range(1, 6):
    print(f"Sector {distance}: Sensor clear, thrusters firing!")
print("Asteroid belt cleared safely!")
`,
    expectedOutput: 'Asteroid belt cleared safely!',
    xpReward: 200,
    badgeId: 'badge-clean-code',
  },
];

// GET all Junior missions
juniorRouter.get('/missions', (_req: Request, res: Response) => {
  res.json({
    success: true,
    missions: JUNIOR_MISSIONS,
  });
});

// SUBMIT mission verification
juniorRouter.post('/missions/:id/complete', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId = 'student-1', code, output } = req.body;

    const mission = JUNIOR_MISSIONS.find((m) => m.id === id);
    if (!mission) {
      return res.status(404).json({ success: false, error: 'Mission not found' });
    }

    // Verify if output matches expected substring
    const isSuccess = output && output.includes(mission.expectedOutput);

    let awardedBadge = null;
    if (isSuccess && mission.badgeId) {
      const awardRes = await badgeStore.awardBadge(userId, mission.badgeId);
      if (awardRes.success) {
        awardedBadge = awardRes.badge;
      }
    }

    res.json({
      success: true,
      verified: isSuccess,
      xpEarned: isSuccess ? mission.xpReward : 20,
      badge: awardedBadge,
      message: isSuccess
        ? `Awesome work! Mission accomplished! +${mission.xpReward} XP awarded!`
        : 'Output did not match expected sensor reading. Check your calculations and run again!',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
