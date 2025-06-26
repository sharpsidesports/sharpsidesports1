import React from 'react';

export default function DetroitGCArticle() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          What to Know About Detroit GC
        </h1>
        <div className="flex justify-center mb-8">
          <img
            src="https://files.constantcontact.com/f381eaf7701/b8bf744e-fd2c-46ea-9eeb-ca515f2eeb83.png"
            alt="Detroit GC Article Visual"
            className="w-3/5 border-4 rounded-lg"
            style={{ borderColor: '#059669' }}
          />
        </div>
        <div className="bg-white rounded shadow border p-6 text-gray-900 text-base leading-relaxed">
          <p className="mb-4">
            Get ready for a birdie fest in Michigan. The winning scores here at Detroit GC in the 6 years they have played here have been -23, -25, -18, -26, -24, and 18. The course lengthened a tad after the first two showings, but clearly the issue isn't the length. The rough is short, the course is very "cuttable", and there isn't much bite. It ranks as the 9th easiest course on Tour this season, the 8th easiest when measuring fairways hit, and only has 2 hazards on the entire course. The rough is being reported as "thicker" this year, but we know how that goes. For 90% of tour spots it is spotty at best and unless there is a serious dedication to it like Oakmont it will not have much effect. There has been very little rain, and there isn't much in the forecast either. This does give us hope for a little bit of defense, as this will be the first year Detroit is not soaked heading into the event.
          </p>
          <p className="mb-4">
            SGOTT in year 1 wasn't a factor at all, with only 1 of the top gained SGOTT players in that tournament recording a top 20. However, in year 2 there was a massive change. Of the top 16 players when measuring SGOTT in 2020, all of them finished inside the top 30. Bryson dominated off the tee the year he won, which made it clear that the bomb and gouge technique is the way to go here. Tony Finau gained 5.8 SGOTT in 2022 on his way to victory, which ranked 2nd overall. The runner up Cam Young gained 5.3 SGOTT which marked 3rd overall that week. In 2023 we saw a switch back to SGAPP, as Rickie, Collin, and Hadwin all ranked in the top 10 when measuring SGAPP, and every player who finished 5th or better ranked in the top 10 when measuring SGAPP for the tournament. Cam Davis was a complete outlier last season. He did not rank in the top 5 when measuring SGAPP or SGOTT, but dominated SGPUTT and SGARG. This is not the norm for any tournament.
          </p>
          <p className="mb-4">
            The Rocket Mortgage is held on the North Course at Detroit Golf Club. Detroit GC is the oldest on Tour rotation, with the North Course being opened in 1916. This par 72 track is designed by Donald Ross, and like we mentioned before, is wide open. It is a classical parkland style that is tree lined, but with the fairways being the 6th widest on Tour, this rarely comes into play. This is one of the most generous courses off the tee, with the fairways being 36 yards wide on average. Since 2015 it is the 8th easiest course when measuring driving accuracy. This obviously translated to players taking driver essentially every chance they get. Field average off the tee last season was over 300 yards AND 59% of drives have over 300 yards since 2020.
          </p>
          <p className="mb-4">
            Detroit GC has a standard deviation of terrain change of 2.18 feet, edging TPC Louisiana (2.23) as the flattest course on Tour. The course is as boring as it gets to be frank. There is little danger, as it ranks lowest on Tour when measuring doubles or worse. There are 4 par 4's under 400 yards, and 2 par 3's under 170. No. 7 and No. 17 are both gettable par 5's that the entire field can reach in 2. In the 16 rounds played both of these holes have posted an eagle % over 2%. Ross is known for having small, tricky greens, and that's no different here with the average green size being 5,150 sq. feet. This Ross staple is on full display at 10, 12, 13, and 14.
          </p>
          <p className="mb-4">
            With that said, the rest of the course's greens aren't entirely difficult, and won't pose as much of an issue, especially given how short this track plays. The greens are a mix of bentgrass and poa annua. They are pure, and with the weather potentially being dry this weekend, have the potential to be difficult this week. 
          </p>
          <p className="mb-4">
            This course plays extremely short, and with the rough being essentially a non-issue, players take driver out pretty much on every hole. This is mirrored by a driver usage of 81% going back to 2020. For this reason we have narrowed our approach distance to 75-125 and 125-150. 49% of approach shots came from this distance in the past 4 years, and this skyrockets to over 75% of approach shots coming from here when looking at just par 4's. For this reason, these prox. zone will hold around 18% combined weight in our model this week.
          </p>
          <p className="mb-4">
            Players have shown they will constantly cut corners and go deep here making even the longer par 4's not challenging at all. The only par 4 with a bogey % over 20% is the 18th that measures 471. That alone should tell you how easy this course plays. We added in eagle% and SG PAR5 to the model hoping that those metrics correlate with proximity from 200+. The first couple years we used opportunities gained, but 2 years ago we substituted that with BoB gained. We didn't cash a winner, but had Niemann in the playoffs, Cameron Young in 2023 last year, and Akshay last year. We this adjustment has help us, and BoB gained will hold around 14% in our model.
          </p>
          <p className="mb-4">
            It is the top predictive metric at this event the past 4 years, and we are predicting this year being different. We added putting into our model just for this reason. If you have been with us for any period of time you know we hate using SGPUTT as a metric simply due to the volatile nature of putting. With that said, since players have to make birdies here, and we've seen "good" putters perform well in the past 3 years we have added it. Specifically we have made it from "birdie range" 10-15 feet. Our mian correlating course and tournament is TPC Twin Cities. Each course is vulnerable to bombers, and each year we see the same players perform well at both. Tony last year was a prime example.
          </p>
          <p className="mb-4">
            Our other correlating courses are Sedgefield, Jackson CC, and TPC Summerlin. Driving Distance is correlated to the T10 finishes here and will make it's non major model debut this week. Course snapshot and key metrics are below.
          </p>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Course Snapshot & Key Metrics</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><span className="font-medium">Course:</span> Detroit Golf Club</li>
              <li><span className="font-medium">Par:</span> 72</li>
              <li><span className="font-medium">Length:</span> 7,370 (22nd shortest on Tour)</li>
              <li><span className="font-medium">Designer:</span> Ross</li>
              <li><span className="font-medium">Course type:</span> Tree-lined Parkland</li>
              <li><span className="font-medium">Fairways:</span> Bentgrass</li>
              <li><span className="font-medium">Avg. Fairway Width:</span> 36 (10th narrowest on Tour)</li>
              <li><span className="font-medium">Rough:</span> Bluegrass 4'</li>
              <li><span className="font-medium">Greens:</span> Bentgrass/Poa Annua mix</li>
              <li><span className="font-medium">Green Size:</span> 5,150 (11th smallest on Tour)</li>
              <li><span className="font-medium">Stimp:</span> 12</li>
            </ul>
          </div>
          {/* Player To Watch Section */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-2">Player To Watch</h2>
            <p className="mb-4">
              <span className="font-bold">BEN GRIFFIN:</span> A top play in our model this week. If you have been paying attention to the PGA Tour you know what kind of break out season this Ben is having. But forget the results, look at his metrics in the last 36 rounds played:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>25 strokes gained on approach</li>
              <li>15.1 strokes gained off the tee</li>
              <li>8.3 birdies or better gained on the field</li>
            </ul>
            <p className="mb-4">
              He has been an elite ball striker, and the distance gained has not gone unnoticed. He was quoted at the Memorial crediting his added length to his success, talking about how he used to hit 6i or 7i with his approach on that par 4 18th. This year… sand wedge.
            </p>
            <p className="mb-4">
              The added distance will go a long way (pardon the pun) at Detroit Golf Club. We already discussed how the driver off the box usage will be over 80%, AND how it has gotten torn apart by bombers in the past. With a firm course we expect the distance to mean even more this week. We have him as the favorite, so there is mega value at the 22/1 range.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 