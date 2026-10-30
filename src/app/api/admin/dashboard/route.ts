import { NextResponse } from "next/server";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      careerCount,
      metricCount,
      ventureCount,
      expertiseCount,
      speakingCount,
      credentialCount,
      awardCount,
      leadershipCount,
      mediaCount,
      testimonialCount,
      assetCount,
      visibleSectionCount,
      totalSectionCount,
      recentLogs
    ] = await Promise.all([
      runQuery("SELECT COUNT(*) as count FROM career_roles"),
      runQuery("SELECT COUNT(*) as count FROM impact_metrics"),
      runQuery("SELECT COUNT(*) as count FROM ventures"),
      runQuery("SELECT COUNT(*) as count FROM areas_of_expertise"),
      runQuery("SELECT COUNT(*) as count FROM speaking_events"),
      runQuery("SELECT COUNT(*) as count FROM credentials"),
      runQuery("SELECT COUNT(*) as count FROM corporate_awards"),
      runQuery("SELECT COUNT(*) as count FROM leadership_roles"),
      runQuery("SELECT COUNT(*) as count FROM media_features"),
      runQuery("SELECT COUNT(*) as count FROM testimonials"),
      runQuery("SELECT COUNT(*) as count FROM media_assets"),
      runQuery("SELECT COUNT(*) as count FROM section_settings WHERE is_visible = TRUE"),
      runQuery("SELECT COUNT(*) as count FROM section_settings"),
      runQuery("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 10"),
    ]);

    return NextResponse.json({
      stats: {
        careerRoles: Number(careerCount[0]?.count || 0),
        impactMetrics: Number(metricCount[0]?.count || 0),
        ventures: Number(ventureCount[0]?.count || 0),
        expertiseDomains: Number(expertiseCount[0]?.count || 0),
        speakingEvents: Number(speakingCount[0]?.count || 0),
        credentials: Number(credentialCount[0]?.count || 0),
        awards: Number(awardCount[0]?.count || 0),
        leadershipRoles: Number(leadershipCount[0]?.count || 0),
        mediaCoverage: Number(mediaCount[0]?.count || 0),
        testimonials: Number(testimonialCount[0]?.count || 0),
        mediaAssets: Number(assetCount[0]?.count || 0),
        visibleSections: Number(visibleSectionCount[0]?.count || 0),
        totalSections: Number(totalSectionCount[0]?.count || 0),
      },
      recentLogs: recentLogs || [],
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve dashboard statistics" },
      { status: 500 }
    );
  }
}
